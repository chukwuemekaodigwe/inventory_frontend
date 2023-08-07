<template>
    <!-- New Income dialog-->
    <v-row justify="center">
        <v-dialog v-model="incomeDialog" persistent width="600px">
            <v-card>
                <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
                    <span class="text-subtitle-2 text-uppercase"> Sale Order Return </span>

                    <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close()"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form validate-on="blur" ref="incomeForm">
                        <v-row>
                            <v-col cols="12" class="d-flex justify-content-center align-items-end">
                                <v-text-field label="Sales OrderId/Invoice No" :append-inner-icon="mdi - search"
                                    placeholder="enter orderId" variant="underlined" v-model="search"></v-text-field>
                                <v-btn icon @click="getOrder">
                                    <v-icon color="tertiary">mdi-send</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-data-table v-if="loaded" :headers="headers" :items="content" class="elevation-1"
                                item-key="sn" items-per-page="6">
                                <template v-slot:item.returned="{ item }">
                                    <v-text-field density="compact" class="w-50 text-center" variant="underlined"
                                        v-model="item.raw.returned" type="number" step="0.0000001"></v-text-field>
                                </template>
                            </v-data-table>
                        </v-row>

                        <v-row>
                            <v-col cols="6" md="6">
                                <v-text-field label="Amount Repaid" variant="outlined" type="number" step="0.00001"
                                    v-model="item.amount"></v-text-field>
                            </v-col>

                            <v-col cols="6" md="6">
                                <v-select variant="outlined" label="Payment Method" v-model="item.p_method"
                                    :items="['Bank', 'POS', 'Cheque', 'Cash']"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea rows="1" label="Reasons for the return" variant="outlined"
                                    v-model="item.desc"></v-textarea>
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <span>What happens to the returned stock </span>
                                <v-radio-group v-model="item.behaviour">
                                    <v-radio label="Return them to stock" value="Yes" />
                                    <v-radio label="Remove them" value="No" />

                                </v-radio-group>
                            </v-col>
                        </v-row>
                    </v-form>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close()">
                        Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="saveReturn">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

</template>

<script lang="ts" setup>
import { useConfigStore } from '~~/store/config'
import { useSalesStore } from '~~/store/sales'
import { useProductStore } from '~~/store/productsStore'

const emit = defineEmits(['close'])
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
    title: '',
    desc: '',
    amount: undefined,
    p_method: '',
    behaviour: '',
    selected: null,
    products: [],
})


const headers = ref([
    {
        title: 'S/N',
        align: 'start',
        sortable: true,
        key: 'sn',
    },
    { title: 'Product', key: 'name' },
    { title: 'Qty', key: 'quantity' },
    { title: 'Unit Price', key: 'price' },
    { title: 'Qty Returned', key: 'returned' },

])
const search = ref('')

function getOrder() {
    $api.post('api/orders/getSalesByOrderNo', { 'term': search.value }).then((res) => {
        const result = res.data.result
        console.log(result)
        if (result.sales) {
            order.value = result.order
            const sa = result.sales; let i = 1;
            sa.forEach(el => {
                const a = {
                    'sn': i++,
                    'name': productStore.getProductById(el.product_id)?.name,
                    'quantity': el.qty,
                    'price': el.price,
                    'product_id': el.product_id,
                    'returned': '',
                    
                }
                content.value.push(a); loaded.value = true
            });


        } else {
            configStore.alert_msg = 'Sales Order not found'
        }
    })
        .catch((err) => {
            console.log(err)
            configStore.alert_msg = 'An error occured'

        })
}

function close() {
    incomeDialog.value = false
    emit('close', true)
}

function saveReturn() {
    if (!salesStore.ledger_id) {
        return salesStore.ledger_alert = true
    }

    const a = {
        'product' : content.value,
        'order': order.value,
        'form' : item,
        'registry': salesStore.ledger_id
    }

    $api.post('/api/returns/save', { 'data': a }).then((res) => {

       // console.log(res.data)
        configStore.alert_msg = 'Successfully saved'
close()    
    })
        .catch((err) => {
            configStore.alert_msg = 'An error occurred while saving'
           // console.log(err)
        })
}


onMounted(() => {
    incomeDialog.value = true
})

</script>