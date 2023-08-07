<template>
    <v-row justify="center">
        <v-dialog persistent v-model="getInvoice" width="500px" >

            <v-card elevation="4" class="pa-5 pb-10 small-invoice" id="inv">
                <div class="d-flex d-row justify-content-space-between" >
                    <v-card-title class="ml-n4"> Sales Invoice</v-card-title>
                    <v-spacer></v-spacer>

                    <v-btn color="error" size="x-small" class="text-right" icon="mdi-close"
              @click="close()"></v-btn>

                    <v-btn color="black" size="x-small" class="text-right" icon="mdi-printer"
              v-print="'#inv'"></v-btn>
                </div>
                
                
                <v-row justify="center">
                    <v-col cols="6">
                        <h4 class="text-tertiary"> {{ company?.name }}</h4>
                        <h6>{{ branch?.title }}</h6>
                        <p class=""> {{ branch?.address }}</p>
                        <p> {{ company?.phone }}</p>
                    </v-col>

                    <v-col cols="6">
                        <div class="">
                            <img src="notpaid.png" alt="" class="rounded" style="width: 100px; float: right;">
                        </div>

                    </v-col>
                    <v-col>
                        <v-divider class="border-secondary-darken-1" thickness="2"></v-divider>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="5">
                        <p class="font-weight-medium text-tertiary">
                            Bill To
                        </p>
                        <p> {{ item.customer ? item.customer.name : item.name }}</p>
                        <p> {{ item.customer ? item.customer.address : item.address }}</p>
                        <p> {{ item.customer ? item.customer.phone : item.phone }}</p>
                    </v-col>

                    <!-- <v-col cols="3">
                                <p class="font-weight-medium">
                                    Delivered To
                                </p>
                                <p>Customer name</p>
                                <p>Address JJJ</p>
                                <p>City, State</p>
                            </v-col> -->

                    <v-col cols="7">
                        <v-row class="">
                            <v-col cols="5">
                                <p class="font-weight-medium text-tertiary text-right"> date</p>
                            </v-col>
                            <v-col cols="7">
                                <p class="text-right"> {{ new Date(item.created_at).toDateString() }}</p>
                            </v-col>
                        </v-row>

                        <v-row class="subsection">
                            <v-col cols="5">
                                <p class="font-weight-medium text-tertiary text-right"> time</p>
                            </v-col>
                            <v-col cols="7">
                                <p class="text-right">
                                    {{ new Date(item.created_at).toLocaleTimeString() }}
                                </p>
                            </v-col>
                        </v-row>
                        <!--
                                <v-row class="subsection">
                                    <v-col cols="6">
                                        <p class="font-weight-medium text-right">Subtotal</p>
                                    </v-col>
                                    <v-col cols="6">
                                        <p class="text-right">90980222.00</p>
                                    </v-col> --
                                </v-row> -->
                    </v-col>


                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-table density="compact">
                            <thead class="bg-primary">
<th>S/N</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Amount</th>
                            </thead>

                            <tbody>
                                <tr v-for="product, i in item.sales">
<td>{{ ++i }}</td>
                                    <td>{{ getProductName(product.product_id) }}</td>
                                    <td> {{ product.qty }}</td>
                                    <td class="text-right"> {{ useConfigStore().currencyFormatter().format(product.price) }}</td>
                                    <td class="text-right"> {{ useConfigStore().currencyFormatter().format(product.price * product.qty) }}
                                    </td>
                                </tr>

                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
                <v-row class="">
                    <v-col cols="4">
                        <v-img :src="`${item.status}.jpg`" style="height: 200px"></v-img>

                    </v-col>
                    <v-col cols="8">
                        <v-row>
                            <v-col cols="6">
                                <p class="text-right">Subtotal</p>
                            </v-col>
                            <v-col cols="6">
                                <p class="text-right"> {{ useConfigStore().currencyFormatter().format(item.total) }}</p>
                            </v-col>

                        </v-row>

                        <v-row class="subsection">

                            <v-col cols="6">
                                <p class="text-right">Tax</p>
                            </v-col>
                            <v-col cols="6">
                                <p class="text-right">{{ parseInt(item.tax).toFixed(2)  }} %</p>
                            </v-col>

                        </v-row>

                        <v-row class="subsection">

                            <v-col cols="6">
                                <p class="text-right">Discount</p>
                            </v-col>
                            <v-col cols="6">
                                <p class="text-right">{{ parseInt(item.discount).toFixed(2) }} %</p>
                            </v-col>

                        </v-row>

                        <v-row class="subsection">

                            <v-col cols="6">
                                <p class="text-right font-weight-bold text-tertiary-darken-2">Total</p>
                            </v-col>
                            <v-col cols="6">
                                <p class="text-right font-weight-medium text-tertiary"> {{
                                    useConfigStore().currencyFormatter().format(item.total_payable) }}</p>
                            </v-col>
                        </v-row>
                        <v-row class="subsection">

                            <v-col cols="6">
                                <p class="text-right font-weight-bold text-tertiary-darken-2 ">Amount Paid</p>
                            </v-col>
                            <v-col cols="6">
                                <p class="text-right font-weight-bold text-tertiary"> {{
                                    useConfigStore().currencyFormatter().format(item.amount_paid) }}</p>
                            </v-col>
                        </v-row>
                        <v-row class="subsection">
                            <v-col cols="6">
                                <p class="text-right font-weight-bold text-tertiary-darken-2 ">Balance</p>
                            </v-col>
                            <v-col cols="6">
                                <p class="text-right font-weight-medium text-tertiary">
                                    {{ useConfigStore().currencyFormatter().format(item.remainder) }}
                                </p>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-divider color="darkred"></v-divider>

                <p class="text-left text-tertiary">Sold By: {{ employee }}</p>
                <span class="d-flex justify-end">
                    <v-btn color="blue-darken-1" variant="" @click="close">
                        Close
                    </v-btn>
                    <v-btn color="black" prepend-icon="mdi-printer"
              v-print="'#inv'"> Print</v-btn>
                </span>
                <v-card-actions style="position: absolute; right:0px; bottom: 0px;">
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script lang="ts" setup>
import { useProductStore } from '~~/store/productsStore';
import { useConfigStore } from '~~/store/config';
import { useUsersStore } from '~~/store/users';
import { useBranchStore } from '~~/store/branchStore';
import { useCustomerStore } from '~~/store/customers';
import { Order } from '~~/store/sales';
import html2PDF from 'jspdf-html2canvas';

import vPrint from '../../node_modules/vue3-print-nb'

const productStore = useProductStore()
const branchStore = useBranchStore()
const getInvoice = ref(false)
const company = computed(() => useConfigStore().company)
const branch = computed(() => branchStore.getBranchById(item.branch_id ? item.branch_id : 1))
const props = defineProps(['order', 'reprint'])
const emit = defineEmits(['close'])
const {$api} = useNuxtApp()

let item:Order = reactive(props.order)
const employee = computed(() => props.order ? useUsersStore().getUserById(item.user_id)?.name : '')

function getProductName(id: number) {
    return productStore.getProductById(id)?.name
}

function close() {

    emit('close', true)
}


function print() {

    let page = document.getElementById('page')

html2PDF(page, {
    jsPDF: {
        format: 'a5',
        orientation: "portrait",
    },
    watermark({ pdf, pageNumber, totalPageNumber }) {
        pdf.setFontSize(8)
        pdf.setTextColor('#000');
        pdf.text(6, pdf.internal.pageSize.height - 5, `Watermark, page: ${pageNumber}/${totalPageNumber}`);
    },
    margin:{
        bottom : 14,
    },
        imageType: 'image/jpeg',
            output: `./pdf/salesInvoice.pdf`
    });
}

function showInvoice(order) {

    item = order
//console.log(order)
    
//console.log(customer)
}

onMounted(() => {
    if(props.reprint){
        showInvoice(props.order)
        $api.get(`api/orders/show/${props.order.id}`).then((res)=>{
            item.sales = res.data.sales
            //c//onsole.log(res)
        })
    }
    getInvoice.value = true

})
</script>

<style>
td {
    text-align: center;
}

.font-weight-medium {
    font-weight: bold;
    text-transform: uppercase;
    //color: rgba(var(--v-theme-tertiary), 0.9)!important;
}

.subsection * {
    margin-top: -10px;


}

.small-invoice p,
.small-invoice th,
.small-invoice td {
    font-size: 1em
}

p,
th,
td {
    font-size: .9em;
}
</style>