<template>
    <div>
    <!-- Transfer dialog-->
    <v-row justify="center">
      <v-dialog v-model="transferDialogue" persistent width="500px">
        <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-h5"> Transfer Stock </span>
            <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close()"></v-btn>
          </v-card-title>
          <v-card-text>
            <v-form validate-on="blur" ref="transferForm">
              <v-row>
                <v-col cols="12">
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
                    <v-text-field variant="outlined" v-model="product.qty" type="number" step="0.00001"
                      min="0" label="Quantity*" required></v-text-field>
                  </v-col>
                </span>

                <v-col cols="12" md="6">
                  <v-autocomplete variant="underlined" :items="branches" item-title="title"
                    item-value="id" v-model="stock.from" label="From"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete variant="underlined" :items="branches" item-title="title"
                    item-value="id" v-model="stock.to" label="To Location"></v-autocomplete>
                </v-col>
                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-textarea variant="outlined" v-model="stock.removeReason"
                    label="Reasons for the Transfer"></v-textarea>
                </v-col>

              </v-row>
            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close('transfer')">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="transferItem">
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
import { useBranchStore } from '~~/store/branchStore'
const { $api } = useNuxtApp()
const configStore = useConfigStore()
const productStore = useProductStore()
const branchStore = useBranchStore()
const products = storeToRefs(productStore).products
const readonly = ref(true)
const transferForm = ref()
const branches = storeToRefs(branchStore).branches
const transferDialogue = ref(true)
const emit = defineEmits(['close'])
const stock = reactive({
  product: '',
  qty: '',
  branch: configStore.branch?.id,
  costprice: '',
  sellingprice: '',
  from: configStore.branch?.id,
  to: null,
  selected: [],
  removeReason: null,
})


function testEmpty(item){
  return item.map((el)=>el.qty).every((el)=>el > 0)
}

async function transferItem() {
      const reason = stock.removeReason
      const payload = stock.selected

      if(reason && testEmpty(payload) && stock.from && stock.to){
        
      $api.post('/api/stocks/transferStock', 
      { 'selected': payload, 'reason': reason, 'from': stock.from, 'to': stock.to })
      .then((res) => {
        configStore.alert_msg = 'Successfully transfered'
      close()
      })
        .catch((err) => {
          configStore.alert_msg = 'An error occurred'
          console.log(err)
        })
      }else{
        configStore.alert_msg = 'Please supply all the details required on the form'
      }
    }

  function  close(item = '') {
        transferDialogue.value = false; transferForm.value.reset()
        emit('close')
    }

onMounted(()=>{
    transferDialogue.value = true
})

onBeforeUnmount(()=>{
   // close()
})
</script>