<template>
    <!-- View Dialog-->
    <v-row justify="center">
        <v-dialog v-model="viewDialog" persistent width="500px">

            <v-card>
                <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
                    <span class="text-medium text-uppercase"> {{ dialogTitle }} </span>

                    <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close()"></v-btn>

                </v-card-title>
                <v-divider></v-divider>

                <v-card-text>
                    <v-form validate-on="blur" ref="viewForm">
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-text-field variant="outlined" :readonly="readonly" v-model="stock.product" color="info"
                                    label="Product">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-text-field variant="outlined" v-model="stock.qty" color="info"
                                    type="number" step="0.00001" min="0" label="Quantity*" :readonly="readonly"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="stock.branch" readonly label="Location" variant="outlined"
                                    color="info"></v-text-field>
                            </v-col>

                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="6">
                                    <small>Stock type</small>&nbsp;
                                    <v-chip :color="getColor(stock.type)">
                                        {{ stock.type }}
                                    </v-chip>
                                </v-col>

                                <v-col cols="6" v-if="stock.type.id == 2">
                                    <small>Status: &nbsp;</small>
                                    <v-chip :color="getStatus(stock.status)?.color">
                                        {{ getStatus(stock.status)?.name }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-col cols="12">
                                <v-textarea variant="outlined" :readonly="readonly"
                                    v-model="stock.removeReason" label="Comment"></v-textarea>
                            </v-col>

                        </v-row>

                    </v-form>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close">
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
const { $api } = useNuxtApp()

const configStore = useConfigStore()
const productStore = useProductStore()
const branchStore = useBranchStore()
const products = storeToRefs(productStore).products
const readonly = ref(true)
const viewForm = ref()
const branches = storeToRefs(branchStore).branches
const viewDialog = ref(false)
const emit = defineEmits(['close'])
const stock = reactive({
    product: '',
    qty: '',
    branch: '',
    costprice: '',
    sellingprice: '',
    from: '',
    to: '',
    selected: [],
    removeReason: '',
    status: 0,
    type: {
        'name': '',
        'id': 0
    }
})
const dialogTitle = ref('')
const props = defineProps(['product'])

function viewItem(e) {
    
    dialogTitle.value = e.product
    stock.product = e.product
    stock.branch = useBranchStore().getBranchById(e.item.branch_id)?.title
    stock.qty = parseInt(e.item.qty)
    stock.removeReason = e.reason
    stock.type = e.type
    stock.status = e.item.status

    viewDialog.value = true
}


function close(item = '') {

    viewForm.value.reset();
    viewDialog.value = false
    emit('close')

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

onMounted(() => {
    viewItem(props.product)
})
</script>