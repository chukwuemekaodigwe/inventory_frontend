<template>
  <div>
    <!-- Remove Stock-->
    <v-row justify="center">
      <v-dialog v-model="removeDialog" persistent width="500px">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h6"> Remove Stock</span>
            <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close()"></v-btn>
          </v-card-title>
          <v-card-text>
            <v-form validate-on="blur" ref="removeForm">
              <v-row>
                <v-col cols="12" md="12">
                  <v-autocomplete variant="underlined" v-model="stock.selected" multiple :items="products"
                    item-title="name" item-value="id" chips clearable return-object
                    label="Select Products"></v-autocomplete>
                </v-col>

                <span class="d-flex flex-row w-100" v-for="product in stock.selected">
                  <v-col cols="6" md="6">
                    <v-textarea variant="outlined" rows="1" readonly color="info" :model-value="product.name"
                      label="Product"> </v-textarea>
                  </v-col>
                  <v-col cols="6" md="6">
                    <v-text-field variant="outlined" v-model="product.qty" 
                    :error-messages="getError" 
                    type="number" step="0.00001"
                      min="0" label="Quantity*" required></v-text-field>
                  </v-col>
                </span>

                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-textarea variant="outlined" v-model="stock.removeReason" label="Reasons for Removal"></v-textarea>
                </v-col>
                

              </v-row>
            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close('remove')">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="saveRemoveStock">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>


  </div>
</template>

<script setup lang="ts">
import { mapState, storeToRefs } from 'pinia'
import { useConfigStore } from '../../store/config'
import { useProductStore } from '~~/store/productsStore'
import { useStockStore } from '~~/store/stocks'
const { $api } = useNuxtApp()
const configStore = useConfigStore()
const productStore = useProductStore()
const stocksStore = useStockStore()


const products = storeToRefs(productStore).products
const removeDialog = ref(false)
const emit = defineEmits(['close']);
const removeForm = ref()

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
})

const getError = computed(()=>(product.qty > stockQty(product.id)) ? `Quantity must be less than ${stockQty(product.id)}` : '')
function stockQty(id:number){
  return stocksStore.getStockQty(id)
}

function testEmpty(item){
  return item.map((el)=>el.qty).every((el)=>el > 0)
}

async function saveRemoveStock() {

  const payload = stock.selected
  
  const reason = stock.removeReason
  
  if (reason && payload.length && testEmpty(payload)) {
    await $api.post('/api/stocks/removeStock', { 'selected': payload, 'reason': reason })
    .then((res) => {
      //console.log(res.data)
      configStore.alert_msg = 'Successfully Removed'
      close()
    })
      .catch((err) => {
        console.log(err)
        configStore.alert_msg = 'An error occurred'
      })
  } else {
    configStore.alert_msg = 'Please fill in all the fields'
  }

}

function close(item = '') {
  removeDialog.value = false; removeForm.value.reset()
  emit('close')  
}

onMounted(()=>{
  removeDialog.value = true
})
</script>