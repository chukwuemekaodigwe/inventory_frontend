<template>
  <v-card>
    <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px" cover>
      <v-card-title class="text-uppercase d-flex justify-space-between">

        <v-btn icon color="error" size="x-small" title="Clear Cart" @click.stop="salesStore.clearCart">
          <v-icon size="x-large">mdi-cart-off</v-icon>
        </v-btn>
        <span class="text-uppercase">
          Store Front
        </span>
        <v-btn icon color="primary" style="float: right;" size="x-small" title="Back to Cart"
          @click.stop="salesStore.cart_out = false; emit('close')">
          <v-icon size="x-large">mdi-close</v-icon>
        </v-btn>

      </v-card-title>
    </v-img>

    <v-form ref="form" validate-on="input">
      <v-card class="pt-2" v-if="!salesStore.check_out">

        <span class="d-flex flex-row align-center" v-for="product in products">
          <v-text-field variant="underlined" class="px-2" density="compact" v-model="product.qty" type="number" min="0"
            :label="`Quantity of ${product.name}`"
            :error-messages="(product.qty > product.inStockQty) ? `Quantity must be less then ${product.inStockQty}` : ''"
            placeholder="Qty of Product"></v-text-field>
          <v-btn icon style="position: absolute; right:4px; z-index:10" size="x-small" color="error"
            @click="removeProduct(product)">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </span>

        <v-card-action>
          <span class="bg-primary text-h6  text-white d-block text-center py-1">
            Total : {{ configStore.currencyFormatter().format(total) }}
          </span>
          <v-btn-toggle class="d-flex flex-row justify-center">
            <v-btn color="error" class="w-50 bg-error" prepend-icon="mdi-reply" size="small"
              @click.stop="salesStore.clearCart">Cancel</v-btn>
            <v-btn class="w-50 bg-success" prepend-icon="mdi-cart" size="small" @click="salesStore.checkOut"
              :disabled="!(salesStore.cart.length > 0)">
              Checkout
            </v-btn>
          </v-btn-toggle>
        </v-card-action>
      </v-card>

      <v-card class="pa-2" v-else>
        <v-text-field density="compact" variant="underlined" v-model="order.customer.name"
          label="Customer Name"></v-text-field>
        <v-text-field density="compact" variant="underlined" v-model="order.customer.phone"
          label="Customer Phone No"></v-text-field>
        <v-text-field density="compact" variant="underlined" v-model="order.customer.address"
          label="Customer Address"></v-text-field>
        <v-text-field density="compact" variant="underlined" v-model="order.discount" :label="`Discount (%)`"
          placeholder="if any"></v-text-field>
        <v-text-field density="compact" variant="underlined" v-model="order.tax" :label="`Tax rate(%)`"
          placeholder="if any"></v-text-field>
        <v-text-field density="compact" variant="underlined" v-model="order.invoice_no" :label="`Invoice No (if any)`"
          placeholder="if any"></v-text-field>


        <span class="text-uppercase font-weight-bold text-caption">
          Select Payment Method :
        </span>
        <v-btn-toggle v-model="method" multiple>

          <v-btn value="cash">
            <span class=''>Cash</span>
          </v-btn>

          <v-btn value="pos">
            <span class="text-small">POS</span>
          </v-btn>

          <v-btn value="bank">
            <span class="text-small">Bank</span>
          </v-btn>

          <v-btn value="cheque">
            <span class=''>Cheque</span>

          </v-btn>

        </v-btn-toggle>


        <span v-if="method.length !== 0" v-for="meth, index in method">
          <v-text-field variant="underlined" v-model="order.payment_method[meth]" @input="amount_paid" type="number"
            step="0.0001" :label="`Amount by ${meth}`" placeholder=""></v-text-field>
        </span>
        <v-card-action class="pa-n1">

          <p class="text-uppercase bg-grey-lighten-1 text-center font-weight-black">
            Payable : <span class="d-none">
              {{ (order.total_payable = (total + (order.tax * total * 0.01)) - (total * order.discount * 0.01)) }}
            </span>

            {{ configStore.currencyFormatter().format(order.total_payable) }}
          </p>
          <span class="bg-blue-darken-4 w-100 text-white d-block text-left px-5 text-uppercase text-medium py-1">
            paid: {{ configStore.currencyFormatter().format(order.amount_paid) }}
          </span>
          <span class="d-none">
            {{ order.remainder = (order.total_payable - order.amount_paid) }}
          </span>
          <span class="text-uppercase w-100 d-block text-left px-5 py-1" :class="order.remainder > 0 ? 'bg-info' : 'bg-error'">
            Bal : {{ configStore.currencyFormatter().format(order.remainder) }}
          </span>
          <span>
            <v-btn-toggle v-model="icon" color="primary" class="elevation-2">
              <v-btn @click="salesStore.check_out = false" class="w-40" size="small" prepend-icon="mdi-reply">
                Back
              </v-btn>

              <v-btn @click="saveDraft" size="small" prepend-icon="mdi-content-save" class="w-30">
                Save
              </v-btn>

              <v-btn @click="submit" size="small" value="right" prepend-icon="mdi-forward" class="w-30">
                Continue
              </v-btn>
            </v-btn-toggle>
          </span>
        </v-card-action>



      </v-card>
    </v-form>

  </v-card>
  
      <invoice-small-invoice @close="close()" :order="invoiceContent" v-if="getInvoice" />
  
</template>

<script setup>
import { useSalesStore } from '~~/store/sales';
import { useCustomerStore } from '../store/customers'
import { useConfigStore } from '~~/store/config';
import { config } from 'process';

const { $api } = useNuxtApp()
const salesStore = useSalesStore()
const customersStore = useCustomerStore()
const configStore = useConfigStore()
const getInvoice = ref(false)
const emit = defineEmits(['close'])
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },

})

const invoiceContent = ref({})

const form = ref(null)
const customers = computed(() => customersStore.getCustomers)
const customer = {
  name: '',
  phone: '',
  address: ''
}

const isDraft = ref(true)
const method = ref([]);
const pay_method = {
  'cash': 0,
  'bank': 0,
  'pos': 0
}
const icon = ref('right')

const amount_paid = () => {
  let c = 0
  if (method.value) {
    const a = (order.payment_method.bank) ? parseFloat(order.payment_method.bank) : 0
    const e = (order.payment_method.pos) ? parseFloat(order.payment_method.pos) : 0
    const b = (order.payment_method.cash) ? parseFloat(order.payment_method.cash) : 0
    const d = (order.payment_method.cheque) ? parseFloat(order.payment_method.cheque) : 0

    c = a + b + d + e
    // console.log(c)

  } else {
    c = 0
  }
  //console.log(c)
  return order.amount_paid = c
}

const total = computed(() => {
  if (products.value.length) {
    const s = products.value.reduce((a, b) => {
      a.total = a.total + (b.qty ? (b.price * b.qty) : 0)
      return a
    }, { total: 0 })

    return order.total = s.total
  } else {
    return 0
  }
})

let new_order = {
  order_id: '',
  invoice_no: '',
  status: 'pending',
  user_id: 0,
  total: 0,
  amount_paid: 0,
  total_payable: 0,
  branch_id: configStore.branch.id,
  remainder: 0,
  discount: 0,
  tax: 0,
  payment_method: {
    'cash': '',
    'bank': '',
    'pos': ''
  },
  customer: {
    name: '',
    phone: '',
    address: ''
  },
  sales: [],
  registry_id: salesStore.ledger_id
}

const cart = computed(() => salesStore.cart)
const products = ref(cart)

let obj = { ...new_order }
let order = reactive(obj)

function removeProduct(product) {
  salesStore.removeFromCart(product)
}
function processData() {
  const code = `${(new Date().getTime())}`
  order.order_id = `#${configStore.keys.sales}${code.substring(3, 9)}`
  order.sales = products.value
  order.user_id = configStore.keys.user
  order.created_at = new Date()
  order.invoice_no = order.invoice_no ? order.invoice_no : '#'
  order.discount = order.discount ? order.discount : 0
  salesStore.checkOut
  return order
}

function submit() {
  //salesStore.$reset()
  
  if (order.customer.name && order.customer.phone && order.total && salesStore.check_out) {
    const data = processData()

    $api.postForm('api/orders/save', { 'order': data }).then((res) => {
      const result = res.data.order
      order.status = result.status
      order.created_at = result.created_at
      //invoiceContent.value = result
      invoiceContent.value = {...order}
      const a = salesStore.saveSale({...order})
      getInvoice.value = true
      

      if (salesStore.is_draft) {
        salesStore.deleteDraft(salesStore.is_draft)
      }

      configStore.alert_msg = 'Successful '
    })
      .catch((err) => {
        configStore.alert_msg = 'Error: Order Unsuccessful'
        console.log(err)

      });

  } else {
    configStore.alert_msg = `Please fill up the customer details 
  & remember to add the quantities of each product selected`
  }

}

async function saveDraft() {

  if (order.customer.name && order.customer.phone && order.total) {
    const data = processData()
    if (salesStore.saveDraft({ ...data })) {

      salesStore.clearCart()
      configStore.alert_msg = 'Order item saved successfully'
      // form.value.reset()
    } else {
      configStore.alert_msg = 'Error: Unsuccessfully'
    }

  } else {
    configStore.alert_msg = 'Error: Please fill up the customer details'
  }

}

function close(){
  salesStore.clearCart()
  getInvoice.value = false

emit('close')

}
</script>

<style scoped>
::placeholder {
  font-size: .7em;
  color: black;
}

.down {
  position: absolute;
  bottom: 40px;
  width: 100%;
  z-index: 7777;

}
</style>