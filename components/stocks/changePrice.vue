<template>
  <!-- Change Price-->
  <v-row justify="center">
    <v-dialog v-model="priceDialog" persistent width="500px">
      <v-card>
        <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
          <span class="text-medium text-uppercase"> {{ 'Change Product Price' }} </span>

          <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close('edit')"></v-btn>

        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-form validate-on="blur" ref="priceForm">
            <v-row>
              <v-col cols="12" md="12">
                <v-autocomplete variant="underlined" v-model="stock.selected" multiple :items="products" item-title="name"
                  item-value="id" chips clearable return-object label="Select Products"></v-autocomplete>
              </v-col>

              <span class="d-flex flex-row w-100" v-for="product in stock.selected">

                <v-col cols="6" md="6">
                  <v-text-field rows="1" variant="outlined" v-model="product.costprice"
                    placeholder="Cost price" type="number" :label="`New Cost price for ${product.name}`" required>
                  </v-text-field>
                </v-col>
                <v-col cols="6" md="6">
                  <v-text-field rows="1" variant="outlined" v-model="product.sellingprice"
                    placeholder="Selling price" type="number" :label="`New Selling price for ${product.name}`"
                    step="0.00001" min="0" required></v-text-field>
                </v-col>
              </span>
              <!-- <v-col cols="12">
                <v-select variant="underlined" :items="branches" item-title="title" item-value="id" v-model="stock.branch"
                  label="Initial Location"></v-select>
              </v-col> -->

            </v-row>
          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close('changeprice')">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveUpdatePrice">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">

import { mapState, storeToRefs } from 'pinia'
import { useConfigStore } from '../../store/config'
import { useProductStore } from '~~/store/productsStore'
import { useBranchStore } from '~~/store/branchStore'


const { $api } = useNuxtApp()
const configStore = useConfigStore()
const productStore = useProductStore()
const branchStore = useBranchStore()


const products = storeToRefs(productStore).products
const readonly = ref(true)
const priceForm = ref()

const priceDialog = ref(false)
const emit = defineEmits(['close'])
const stock = reactive({
  product: '',
  qty: '',
  branch: null,
  costprice: '',
  sellingprice: '',
  from: null,
  to: null,
  selected: [],
  removeReason: null,
  status: 0,
  type: {
    'name': '',
    'id': 0
  }
})
const dialogTitle = ref('')
const props = defineProps(['product'])


function testEmpty(item){
  return item.map((el)=>el.sellingprice).every((el)=>el > 0)
}

async function saveUpdatePrice() {
  const payload = stock.selected
  console.log(payload)
  if (payload.length && testEmpty(payload)) {
    $api.post('/api/products/changePrice', { 'products': payload }).then((res) => {
      const result = res.data.products
      result.forEach((el) => {
        productStore.updateProduct(el)
      })
      configStore.alert_msg = 'Updated Successfully'
      close()
    })
      .catch((err) => {
        configStore.alert_msg = 'An error occurred'
        console.log(err.response)
      })
  }else{
    configStore.alert_msg = 'Please provide all the details'
  }
}

function close(item = '') {
  priceDialog.value = false; priceForm.value.reset()
  emit('close')
}

onMounted(()=>{
  priceDialog.value = true
})

</script>