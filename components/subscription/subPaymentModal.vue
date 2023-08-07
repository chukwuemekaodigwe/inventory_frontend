<template>
  <!-- New Income dialog-->
  <v-row justify="center">
    <v-col cols="12" sm="7" md="5" class="mx-auto">
      <v-card elevation="8" class="pa-5">
        <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
          <span class="text-subtitle-2 text-uppercase"> Subscription </span>

          <!-- <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close()"></v-btn> -->
        </v-card-title>
        <v-card-text>
          <v-form validate-on="blur" ref="incomeForm">
            <v-row>
              <v-col cols="12">
                <v-select density="compact" variant="outlined" label="Subscription Plan" v-model="item.p_method"
                  :items="subPlans" @update:model-value="getSum()" return-object></v-select>
              </v-col>
              <!-- 
                            <v-col cols="12" class="d-flex justify-content-center align-items-end">
                                <v-text-field label="Customer phone or OrderId/Invoice "
                                    placeholder="enter customer phone/orderId" variant="underlined"
                                    v-model="search"></v-text-field>
                                <v-btn icon @click="getOrder">
                                    <v-icon color="tertiary">mdi-send</v-icon>
                                </v-btn>
                            </v-col> -->
            </v-row>
            <v-row>

              <v-col cols="6" md="6">
                <v-text-field label="Customer Name" variant="outlined" v-model="item.customer_name"></v-text-field>
              </v-col>

              <v-col cols="6" md="6">
                <v-text-field label="Customer Phone" variant="outlined" v-model="item.customer_phone"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-select label="Select a Preferred Duration" variant="outlined" :items="durations" item-value="number"
                  item-title="title" v-model="item.duration" @update:model-value="getSum()"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex my-n3" style="flex-flow: column nowrap; align-items: center; justify-content: center;">
                <span class="text-caption">Total Payable</span>
                <v-btn color="indigo" style="box-shadow: inset 0px 0px 4px 2px violet, 1px 1px 3px 2px orangered;"
                  size="large" @click="checkout()" variant="outlined" class="text-center rounded-xl"> Pay {{
                    useConfigStore().currencyFormatter().format(item.amount)
                  }}</v-btn>
              </v-col>
            </v-row>
          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close()">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="checkout()">
            continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <!-- </v-dialog> -->
  </v-row>
</template>
  
<script lang="ts" setup>
import { useConfigStore } from '~~/store/config'
import { useSalesStore } from '~~/store/sales'
import { useProductStore } from '~~/store/productsStore'
import { useSubscriptionStore, Plan } from '../../store/subscription'
import { useUsersStore } from '~~/store/users'

const emit = defineEmits(['close', 'completed', 'started'])
const { $api } = useNuxtApp()
const configStore = useConfigStore()
const productStore = useProductStore()
const salesStore = useSalesStore()
const content = ref([])
const order = ref()
const sales = ref([])
const loaded = ref(false)
const incomeDialog = ref(false)

let item = reactive({
  customer_name: '',
  customer_phone: '',
  amount: 0,
  p_method: {},
  duration: '',
  customer_email: null,

})
const durations = ref([
  {
    'id': 1,
    'number': 3,
    'title': '3 Months'
  },
  {
    'id': 2,
    'number': 6,
    'title': '6 Months'
  },
  {
    'number': 12,
    'title': '12 Months'
  },
  {
    'number': 24,
    'title': '24 Months'
  },
])

const subPlans = computed(() => useSubscriptionStore().plans.length ? useSubscriptionStore().plans : [])

function getSum() {

  const a = item.p_method
  if (item.duration && a.amount) {
    item.amount = a?.amount * item.duration
  } else {
    return 1
  }

}


function close() {
  incomeDialog.value = false
  emit('close', true)
}

const props = defineProps(['plan', 'renew'])

function checkout() {
  const payload = item

  const a = {
    'amount': payload.amount,
    'currency': useConfigStore().company.currency,
    'customerName': payload.customer_name,
    'customerEmail': payload.customer_email,
    'metaData': {
      'customer_email': payload.customer_email,
      'plan_id': payload.p_method.id,
      'type': useConfigStore().company.id ? 'renewal' : 'new',
    },
    'paymentDescription': 'Payment for service of VIP SAAS Point of Sale'
  }
  emit('completed')

  // Monnify(a).then((res) => {
  //   console.log(a)
  // })
  //   .catch((err) => {
  //     console.log(err)
  //   })

}

const envConfig = useRuntimeConfig()

async function Monnify(payload) {
  const { amount, currency, customerName, customerEmail, metaData, paymentDescription } = payload
  MonnifySDK.initialize({
    amount: amount,
    currency: currency,
    reference: new String((new Date()).getTime()),
    customerFullName: customerName,
    customerEmail: customerEmail,
    apiKey: 'MK_TEST_MZZWH5ZF9N', // envConfig.public.MONNIFYAPIKEY,
    contractCode: '9210510205', //envConfig.public.MONNIFYCONTRACTCODE,
    paymentDescription: paymentDescription,
    metadata: metaData,

    onLoadStart: () => {
      console.log("loading has started");
    },
    onLoadComplete: () => {
      console.log("SDK is UP");
      emit('started', metaData)
    },

    onComplete: function (response) {
      //Implement what happens when the transaction is completed.
      console.log(response);
      emit('completed', response)
    },
    onClose: function (data) {
      //Implement what should happen when the modal is closed here
      //      console.log(data);
      emit('closed', data)
    }
  })
}

function testTransaction(transRef: string) {
  const url = envConfig.public.MONNIFYBASEURL
  $api.get(`${url}/api/v2/transactions/${transRef}`).then((res) => {


  })
    .catch((err) => {

    })
}

function initialize(plan: Plan) {

  // const a = useSubscriptionStore().getPlanById(plan)
  //item.amount = a?.amount
  item.p_method = plan
  item.amount = plan.amount * 3
  if (props.renew) {
    const admin = configStore.company.admin
    const b = useUsersStore().getUserById(admin)
    item.customer_name = b?.name
    item.customer_phone = b?.phone
    item.customer_email = b?.email
  } else {
    const b = configStore.user
    item.customer_name = b.name
    item.customer_phone = b.phone
    item.customer_email = b.email
  }
}
onMounted(() => {

  let recaptchaScript = document.createElement('script')
  recaptchaScript.setAttribute('src', 'https://sdk.monnify.com/plugin/monnify.js')
  document.head.appendChild(recaptchaScript)

  initialize(props.plan)
  incomeDialog.value = true
})

</script>