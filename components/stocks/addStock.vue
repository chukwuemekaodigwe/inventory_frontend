<template>

  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="500px">
      <v-card>
        <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
          <span class="text-subtitle-2 text-uppercase"> {{ 'Add Stock' }} </span>

          <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close('edit')"></v-btn>
</v-card-title>
        <v-card-text>
          <v-form validate-on="blur" ref="stockForm">
            <v-row>
              <v-col cols="12" md="12">
                <v-autocomplete variant="underlined" v-model="stock.selected" multiple 
                :items="products" item-title="name"
                  item-value="id" chips return-object label="Select Products"></v-autocomplete>
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
              <v-divider class="my-2"></v-divider>
              <v-col cols="12">
                <v-autocomplete variant="underlined" :items="branches" item-title="title" item-value="id"
                  v-model="stock.branch" label="Initial Location"></v-autocomplete>
              </v-col>
              <v-divider class="my-2"></v-divider>
              <v-col cols="12">
                <v-textarea variant="outlined" v-model="stock.removeReason"
                  label="Brief Note(optional)"></v-textarea>
              </v-col>

            </v-row>

          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close('add')">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveNewStock">
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
import { useUsersStore } from '~~/store/users'

const { $api } = useNuxtApp()
const configStore = useConfigStore()
const productStore = useProductStore()
const branchStore = useBranchStore()
const usersStore = useUsersStore()

const products = storeToRefs(productStore).products
const readonly = ref(true)
const stockForm = ref()
const branches = storeToRefs(branchStore).branches
const dialog = ref(false)
const emit = defineEmits(['close'])

const stock = reactive({
  product: '',
  qty: '',
  branch: configStore.branch?.id,
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

function close(item = '') {

  stockForm.value.reset(); dialog.value = false;
  emit('close')
}

function testEmpty(item){
  return item.map((el)=>el.qty).every((el)=>el > 0)
}


async function saveNewStock() {
  const payload = stock.selected
  console.log(payload)
  //throw new Error("DD");
  
  const reason = stock.removeReason
  if (payload.length && testEmpty(payload)) {
    await $api.post('api/stocks/saveNewStock',
      { 'selected': payload, 'reason': reason, 'branch': stock.branch })
      .then((res) => {
        console.log(res.data)
        //isHistory = true
        configStore.alert_msg = 'Stock Successfully added'
        close()
      })
      .catch((err) => {
        configStore.alert_msg = 'An error occured'
        console.log(err)
      })
  } else {
    configStore.alert_msg = 'Please supply all required fields'
  }

}

onMounted(()=>{
  dialog.value = true
})

</script>