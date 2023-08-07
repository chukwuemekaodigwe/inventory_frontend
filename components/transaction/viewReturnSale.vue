<template>
    <!-- New Income dialog-->
    <v-row justify="center">
        <v-dialog v-model="incomeDialog" persistent width="600px">
            <v-card>
                <v-card-title class="d-flex align-center"
                    style="flex-flow: row nowrap; justify-content: space-between; align-items: flex-start;">
                    <span class="text-subtitle-2 text-uppercase"> Return Sale </span>
                    <span>
                        <v-text-field type="date" :model-value="formatDate(new Date(item.date))" density="compact"
                            variant="underlined" readonly label="Date Returned" width="10px" />
                    </span>

                    <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close()"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form validate-on="blur" ref="incomeForm">
                        <!-- <v-row>
                            <v-col cols="12" class="d-flex justify-content-center align-items-end">
                                <v-text-field label="Customer phone or OrderId/Invoice "
                                    placeholder="enter customer phone/orderId" variant="underlined"
                                    v-model="search"></v-text-field>
                                <v-btn icon @click="getOrder">
                                    <v-icon color="tertiary">mdi-send</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row> -->
                        <v-row>

                            <v-col cols="6" md="6">
                                <v-text-field label="Customer Name" variant="outlined"
                                readonly    v-model="item.customer_name"></v-text-field>
                            </v-col>

                            <v-col cols="6" md="6">
                                <v-text-field label="Customer Phone" variant="outlined"
                                 readonly   v-model="item.customer_phone"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-data-table v-if="loaded" :headers="headers" :items="content" class="elevation-1"
                                item-key="sn" items-per-page="6">
                                <template v-slot:item.select="{ item }">
                                    <v-checkbox-btn density="compact" class="w-50 text-center" variant="underlined"
                                        :value="item.raw.id"
                                        @input="item.raw.select ? getSum(item.raw.item.remainder) : getSum(-(item.raw.item.remainder))"
                                        v-model="item.raw.select"></v-checkbox-btn>
                                </template>
                            </v-data-table>
                        </v-row>

                        <v-row>
                            <v-col cols="6" md="6">
                                <v-text-field readonly label="Amount Paid" variant="outlined" type="number" step="0.00001"
                                    v-model="item.amount"></v-text-field>
                            </v-col>

                            <v-col cols="6" md="6">
                                <v-text-field readonly label="Payment Method" variant="outlined" 
                                    v-model="item.p_method"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea rows="1" label="Reason for the Return" variant="outlined"
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
                    <!-- <v-btn color="blue-darken-1" variant="text" @click="saveReturn">
                        Save
                    </v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script lang="ts" setup>
import { useConfigStore } from '~~/store/config'
import { useSalesStore } from '~~/store/sales'
import { useProductStore } from '~~/store/productsStore'
import { DatasetController } from 'chart.js'

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
    customer_name: '',
    customer_phone: '',
    amount: 0,
    p_method: '',
    desc: '',
    behaviour: '',
    date: ''

})
const props = defineProps(['product'])
const headers = ref([
    {
        title: 'S/N',
        align: 'start',
        sortable: true,
        key: 'sn',
    },

    { title: 'Product', key: 'item' },
    { title: 'SKU', key: 'sku' },
    { title: 'Qty Returned', key: 'qty' },

])
const search = ref('')

function getOrder() {

    const result = props.product.item
    console.log(result)
    const details = JSON.parse(result.details);

    if (details.length) {
        let i = 1;
        details.forEach(el => {
            // = el.payment_method
            const p = productStore.getProductById(el.product)
            const a = {
                'sn': i++,
                'item': p?.name,
                'qty': el.qty,
                
                'sku': p?.sku,
            }
            content.value.push(a);
        });
        item.customer_name = result.name
        item.customer_phone = result.phone
        item.amount = result.amount_repaid
        item.p_method = result.payment_method
        item.desc = result.reason
        item.behaviour = result.stockBehaviour ? "Yes" : 'No'
        item.date = result.ledger_date

        loaded.value = true

    } else {
        configStore.alert_msg = 'An error occured'
    }

}

function getSum(val) {
    const amt = item.amount
    item.amount = parseFloat(amt) + parseFloat(val)
}


function close() {
    incomeDialog.value = false
    emit('close', true)
}


onMounted(() => {
    incomeDialog.value = true
    getOrder()
})

</script>