<template>
    <!-- Edit Dialog-->
    <v-row justify="center">
        <v-dialog v-model="editDialog" persistent width="500px">

            <v-card>
                <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
                    <span class="text-medium text-uppercase"> {{ dialogTitle }} </span>

                    <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close('edit')"></v-btn>

                </v-card-title>
                <v-divider></v-divider>

                <v-card-text>
                    <v-form validate-on="blur" ref="editForm">
                        <v-row>
                            <v-col cols="12" md="12">
                                <v-select variant="outlined" v-model="stock.product" :items="products" item-title="name"
                                    item-value="id" return-object label="Select Products"></v-select>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-text-field variant="outlined" v-model="stock.qty" type="number"
                                    step="0.00001" min="0" label="Quantity*" required></v-text-field>
                            </v-col>

                            <v-divider class="my-2"></v-divider>
                            <v-col cols="12">
                                <v-select variant="outlined" :items="branches" item-title="title" item-value="id"
                                    v-model="stock.branch" label="Initial Location"></v-select>
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
                    <v-btn color="blue-darken-1" variant="text" @click="close('edit')">
                        Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="saveEdit">
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
const editForm = ref()
const branches = storeToRefs(branchStore).branches
const editDialog = ref(false)
const emit = defineEmits(['close'])
const stock = reactive({
    product: {
        'name': '',
        'id': 0
    },
    qty: 0,
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


function editItem(e) {
    console.log(e)
    dialogTitle.value = e.product
    stock.product = { name: e.product, id: e.product_id }
    stock.branch = e.item.branch_id
    stock.qty = parseInt(e.item.qty)
    stock.removeReason = e.reason
    stock.id = e.id
    editDialog.value = true

    
}

function testEmpty(item){
  return item.map((el)=>el.qty).every((el)=>el > 0)
}


function saveEdit() {
    // console.log(stock.selected)
    const payload = {
        'product': stock.product,
        'branch': stock.branch,
        'qty': stock.qty,
        'reason': stock.removeReason,
        'id': stock.id
    }

    
    if (payload.qty && payload.product.name) {
        $api.patch('/api/stocks/editStock', { 'payload': payload }).then((res) => {
            configStore.alert_msg = 'Updated Successfully'
            console.log({ 'result': res.data })
            close()
        })
            .catch((err) => {

                configStore.alert_msg = 'An error occurred'
                console.log(err)
            })
    } else {
        configStore.alert_msg = 'Please fill up the form & make the correct changes'
    }
}

function close(item = '') {
    editDialog.value = false;
    editForm.value.reset()
    emit('close')
}

onMounted(()=>{
    editItem(props.product)
})
</script>