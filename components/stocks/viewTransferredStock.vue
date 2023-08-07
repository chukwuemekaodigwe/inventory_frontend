<template>

    <!-- view for transferred stock -->

    <v-row justify="center">
      <v-dialog v-model="transferredItemDialog" persistent width="500px">

        <v-card>
          <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
            <span class="text-medium text-capitalize"> Transfer of {{ dialogTitle }}</span>
            <v-spacer></v-spacer>

            <v-chip :color="getStatus(stock.status)?.color">
              {{ getStatus(stock.status)?.name }}
            </v-chip>

            <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close('transferred')"></v-btn>

          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-form ref="transferredItemForm">
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field :model-value="stock.product" label="Product" readonly variant="outlined"
                    color="info"></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field variant="outlined" :model-value="stock.item.no_items" type="number"
                    step="0.00001" min="0" label="Quantity*" :readonly="readonly"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field type="date" variant="outlined" :readonly="readonly" :model-value="stock.created_at"
                    label="Transfer Date"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field type="date" variant="outlined" :readonly="readonly" :model-value="stock.updated_at"
                    label="Receival Date"></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-text-field :model-value="stock.from" label="From" variant="outlined" readonly
                    color="info"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field :model-value="stock.branch" label="To" variant="outlined" readonly
                    color="info"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field variant="outlined" :readonly="readonly" :model-value="stock.item.user"
                    label="Transfered By"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field variant="outlined" :readonly="readonly" :model-value="stock.receiver"
                    label="Received By"></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-divider class="my-2"></v-divider>
                <v-col cols="12">
                  <v-textarea variant="outlined" :readonly="readonly" :model-value="stock.item.reason"
                    label="Comment"></v-textarea>
                </v-col>

              </v-row>

            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close('transferred')">
              Close
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
const viewForm = ref()
const branches = storeToRefs(branchStore).branches
const viewDialog = ref(false)
const emit = defineEmits(['close'])
let stock = reactive({
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
const transferredItemDialog = ref(false)
const transferredItemForm = ref()

function close(item = '') {
        transferredItemDialog.value = false; transferredItemForm.value.reset()  
            emit('close')
    }

    function viewItem(e) {
      console.log(e)
      dialogTitle.value = e.product
      stock.product = e.product
      stock.branch = branchStore.getBranchById(e.item.branch_id)?.title
      stock.qty = parseInt(e.item.qty)
      stock.removeReason = e.reason
      stock.type = e.type
      stock.status = e.item.status
      
        stock.item = e
        stock.created_at = formatDate(new Date(e.item.created_at))

        if (e.item.received_by) {
          stock.receiver = usersStore.getUserById(e.item.received_by)?.name
          stock.updated_at = formatDate(new Date(e.item.updated_at))
          stock.from = branchStore.getBranchById(e.item.from)?.title
        }
        
        transferredItemDialog.value = true
    
    }

    function getColor(item) {
    let color = ''
    if (item == 1) {
        color = 'info'
    } else if (item == 2) {
        color = 'warning'
    } else {
        color = 'error'
    }

    return color
}

function getStatus(id:number) {
  
  if (id == 1) {
    return { 'color': 'green', 'name': 'received' }
  } else if (id == 2) {
    return { 'color': 'error', 'name': 'pending' }
  }
}


onMounted(()=>{
    viewItem(props.product)
})
</script>