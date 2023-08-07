<template>
    <v-sheet class="m-0 m-n2" elevation="6" id="page">
        <v-tabs v-model="tab" color="purple-accent-4" align-tabs="center">
            <v-tab value="today" @click="showTable('today')" v-if="hasPermission(permiss.today)"> Today</v-tab>
            <v-tab value="timeline" @click="showTable('timeline')" v-if="hasPermission(permiss.timeline)"> Transactions</v-tab>
            <v-tab value="sales" v-if="hasPermission(permiss.sales)"  @click="showTable('sales')">Sales</v-tab>
            <v-tab value="summary" v-if="hasPermission(permiss.summary)" @click="showTable('summary')"> Sales Summary</v-tab>
            <v-tab value="income" @click="showTable('income')" v-if="hasPermission(permiss.income)"> Other Income</v-tab>
           
            <v-tab value="expenses" v-if="hasPermission(permiss.expenses)" @click="showTable('expenses')">Expenses</v-tab>
            <v-tab value="transfer" v-if="hasPermission(permiss.transfer)" @click="showTable('transfer')"> Fund Transfer</v-tab>
           
            <v-tab value="returned" v-if="hasPermission(permiss.returned)" @click="showTable('returned')">Return Sales</v-tab>
            <v-tab value="repayment" v-if="hasPermission(permiss.timeline)" @click="showTable('repayment')"> Debt Repayment</v-tab>
            <!-- <v-tab @click="showTable('deleted')">Deleted Stock</v-tab> -->
        </v-tabs>

        <v-window v-model="tab2">
            <v-window-item :value="0">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getByDate" @search-by-range="getByRange"
                        @search="searchTable" @feature="getFeature" @print="download" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="1" :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="1">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getByDate" @search-by-range="getByRange"
                        @search="searchTable" @feature="getFeature" @print="download" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="2" :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="2">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getByDate" @search-by-range="getByRange"
                        @search="searchTable" @feature="getFeature" @print="download" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="3" :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="3">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getByDate" @search-by-range="getByRange"
                        @search="searchTable" @feature="getFeature" @print="download" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="4" :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="4">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getByDate" @search-by-range="getByRange"
                        @search="searchTable" @feature="getFeature" @print="download" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="5" :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="5">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getByDate" @search-by-range="getByRange"
                        @search="searchTable" @feature="getFeature" @print="download" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="6" :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="6">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getByDate" @search-by-range="getByRange"
                        @search="searchTable" @feature="getFeature" @print="download" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="7" :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>


            <v-window-item :value="7">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getByDate" @search-by-range="getByRange"
                        @search="searchTable" @feature="getFeature" @print="download" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="2" :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="8">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getByDate" @search-by-range="getByRange"
                        @search="searchTable" @feature="getFeature" @print="download" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="2" :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

        </v-window>


        <DeleteAlert @submitted="showTable(tab)" />
        <TransactionNewTransfer @close="showTable(tab); get_transfer = false" v-if="get_transfer" />
        <TransactionNewExpenses @close="showTable(tab); get_expense = false" v-if="get_expense" />
        <TransactionNewIncome @close="showTable(tab); get_income = false;" v-if="get_income" />
        <TransactionTransDIalogue @close="get_crud = false; showTable(tab)" :task="task" :items="product" v-if="get_crud" />
        <TransactionViewReturnSale v-if="get_return" @close="get_return = false" :product="product" />
        <InvoiceSmallInvoice :order="product" :reprint="true" v-if="get_sale" @close="get_sale = false" />
    </v-sheet>
</template>

<script setup lang="ts">
import html2PDF from 'jspdf-html2canvas';
import myDataTable from '~~/components/myDataTable.vue';
import { useConfigStore } from '~~/store/config';
import { useBranchStore } from '~~/store/branchStore';
import { useUsersStore } from '~~/store/users';
import { Product, useProductStore } from '~~/store/productsStore';
import { useStockStore } from '~~/store/stocks';
import { storeToRefs } from 'pinia';
import { usePermissionStore } from '~~/store/permissions';


const { $api } = useNuxtApp()
const configStore = useConfigStore()
const branchStore = storeToRefs(useBranchStore())
const usersStore = storeToRefs(useUsersStore())
const productsStore = storeToRefs(useProductStore())
const stocksStore = storeToRefs(useStockStore())

const feature = ref([
    { text: 'New Income', icon: 'mdi-cash-plus' },
    { text: 'New Expenses', icon: 'mdi-cash-minus' },
    { text: 'New Fund Transfer', icon: 'mdi-reply' },

    { text: 'New Sales', icon: 'mdi-cart-plus' },
])

const get_transfer = ref(false)
const get_crud = ref(false)
const get_income = ref(false)
const get_expense = ref(false)
const get_sale = ref(false)
const get_return = ref(false)
const task = ref('')
const product = ref({})
const tab = ref('today')
const tab2 = ref(0)
const loading = ref(false)
const header = ref([{}])
const content = ref([{}])


function getFeature(item) {

    if (item.includes('Income')) {

        get_income.value = true
    } else if (item.includes('Transfer')) {

        get_transfer.value = true
    } else if (item.includes('Expense')) {

        get_expense.value = true
    } else if (item.includes('Sales')) {
        navigateTo('/store')
    }
}

const permiss = {
    'today': [
        'can_view_own_records', 'can_view_others_records', 'can_view_branch_records'
    ],
    'timeline': [
    "can_add_others_records","can_view_others_records","can_edit_others_records","can_delete_others_records","can_view_branch_records","can_edit_branch_records","can_delete_branch_records","can_add_other_branch_records","can_view_other_branch_records","can_edit_other_branch_records", "can_delete_other_branch_records", 
    ],
    'sales': [
    "can_view_payments","can_edit_payments","can_delete_payments",
    "can_add_others_records","can_view_others_records","can_edit_others_records","can_delete_others_records","can_view_branch_records","can_edit_branch_records","can_delete_branch_records","can_add_other_branch_records","can_view_other_branch_records","can_edit_other_branch_records","can_delete_other_branch_records", "can_view_sales","can_edit_sales","can_delete_sales",
    ],

    'summary': [
        'can_view_sales_summary'
    // "can_add_others_records","can_view_others_records","can_edit_others_records", "can_delete_others_records","can_view_branch_records","can_edit_branch_records","can_delete_branch_records","can_add_other_branch_records","can_view_other_branch_records","can_edit_other_branch_records","can_delete_other_branch_records"
    ],
    'income': [
    "can_add_others_records","can_view_others_records","can_edit_others_records","can_delete_others_records","can_view_branch_records","can_edit_branch_records","can_delete_branch_records","can_add_other_branch_records","can_view_other_branch_records","can_edit_other_branch_records", "can_edit_income","can_delete_income","can_delete_other_branch_records",
    "can_view_income",
    ],

    'expenses': [
    "can_add_others_records","can_view_others_records","can_edit_others_records","can_delete_others_records","can_view_branch_records","can_edit_branch_records","can_delete_branch_records","can_add_other_branch_records","can_view_other_branch_records","can_edit_other_branch_records","can_delete_other_branch_records",

    "can_view_expenses","can_edit_expenses","can_delete_expenses",
    
    ],

    'transfer': [
    "can_view_fund_transfer","can_edit_fund_transfer","can_delete_fund_transfer",
    "can_add_others_records","can_view_others_records","can_edit_others_records","can_delete_others_records","can_view_branch_records","can_edit_branch_records","can_delete_branch_records","can_add_other_branch_records","can_view_other_branch_records","can_edit_other_branch_records","can_delete_other_branch_records", "can_view_fund_transfer","can_edit_fund_transfer","can_delete_fund_transfer",
    ],

    'returned' : [
    "can_add_others_records","can_view_others_records","can_edit_others_records","can_delete_others_records","can_view_branch_records","can_edit_branch_records","can_delete_branch_records","can_add_other_branch_records","can_view_other_branch_records","can_edit_other_branch_records", "can_delete_other_branch_records",
    "can_view_product_returns","can_edit_product_returns","can_delete_product_returns",
]
}
function showView(item) {

    task.value = 'view'

    if (tab.value == 'sales') {
        product.value = item.item
        return get_sale.value = true
    }
    if (tab.value == 'returned') {
        product.value = item
        return get_return.value = true
    }

    product.value = item
    if (product.value) {
        get_crud.value = true
    }

}

function editItem(item) {
    if (tab.value == 'sales' || tab.value == 'returned') {
        return configStore.alert_msg = "Can't perform this action"
    }
    product.value = item
    task.value = 'edit'
    get_crud.value = true
}

function deleteItem(item) {

    if (tab.value == 'returned') {
        return configStore.alert_msg = "Can't perform this action, please"
    }


    let url = ''
    if (item.type && item.type.includes('income')) {
        url = `/api/incomes/deleteIncome/${item.item.id}`
    } else if (item.order_no) {
        url = `/api/orders/delete/${item.item.id}`

    } else {
        url = `/api/expenses/deleteExpense/${item.item.id}`
    }

    configStore.delete_alert = url
}

function showTable(page: string, ev?: string) {

    switch (page) {
        case 'today':
            tab2.value = 0
            //configStore.pageTitle = 'Page Result Based on Active Ledger'
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },
                { title: 'Title', key: 'title' },

                { title: 'Type', key: 'type' },
                { title: 'Amount', key: 'amount' },
                { title: 'Method', key: 'method' },
                { title: 'Employee', key: 'user' },
                //{ title: 'Note', key: 'reason' },
                { title: 'Actions', key: 'actions', sortable: false },
            ]
            let url = ''
            if (hasPermission(["can_view_own_records"])) {
                url = '/api/transactions/getTodayTransactionPerUser'
            } else {
                url = '/api/transactions/getTodayTransaction'
            }

            $api.post(url).then((res) => {
                const result = res.data.result
                if (res.data.data) {
                    result.data = res.data.data
                }

                //console.log(result)
                processResult(result, 'post').then((res) => {
                    content.value = res
                    loading.value = false
                })
            })
                .catch((err) => {
                    console.log(err.response)
                    configStore.alert_msg = 'An error occurred'
                })
            break;

        case 'summary':
            tab2.value = 3
            configStore.pageTitle = 'Page Result Based on Active Ledger'
            loading.value = true
            header.value = [
                {
                    title: 'S/N',
                    align: 'start',
                    sortable: true,
                    key: 'sn',
                },
                { title: 'Product', key: 'product' },
                { title: 'SKU', key: 'product_sku' },
                { title: 'Qty Sold', key: 'total_sold' },
                { title: 'Gross Profit', key: 'gross_total' },
                { title: 'Net Profit', key: 'profit' },
                // { title: 'Actions', key: 'actions', sortable: false },
            ]

            $api.get('api/orders/getOrderSummary').then((res) => {
                const results = res.data.result
                //    console.log(results)
                processResult(results, 'get').then((res) => {
                    content.value = res
                    loading.value = false
                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occured'
                    console.log(err)
                })
            break;

        case 'timeline':

            tab2.value = 1
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },
                { title: 'Title', key: 'title' },
                { title: 'Type', key: 'type' },
                { title: 'Amount', key: 'amount' },
                { title: 'Method', key: 'method' },
                { title: 'Employee', key: 'user' },
                // { title: 'Note', key: 'reason' },
                { title: 'Actions', key: 'actions', sortable: false },
            ]

            $api.get('/api/transactions/getTransactions').then((res) => {
                //  console.log(res.data)
                const result = res.data.result
                result.data = res.data.data
                processResult(result, 'get').then((res) => {

                    loading.value = false
                    content.value = res

                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occurred'
                    console.log(err)
                })
            break;

        case 'sales':
            tab2.value = 2
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },
                { title: 'OrderNo', key: 'order_no' },
                { title: 'Invoice No', key: 'invoice_no' },
                { title: 'Customer Name', key: 'customer' },
                { title: 'No of Items', key: 'no_items' },
                { title: 'Total', key: 'total' },
                { title: 'Amount Paid', key: 'paid' },
                { title: 'To Be Paid', key: 'due' },
                //{ title: 'Method', key: 'payment_method' },
                { title: 'Actions', key: 'actions', sortable: false },
            ]

            $api.get('api/orders/getSalesOrder').then((res) => {
                const result = res.data.result

                processResult(result, 'get').then((res) => {
                    content.value = res
                    loading.value = false
                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occurred'
                    console.log(err.response.data)
                })
            break;

        case 'transfer':
            tab2.value = 6
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },

                { title: 'Title', key: 'title' },
                { title: 'Type', key: 'type' },
                { title: 'Amount', key: 'amount' },
                { title: 'Account Name', key: 'acct_name' },
                { title: 'Account No', key: 'acct_no' },
                { title: 'Bank', key: 'bank' },
                { title: 'Method', key: 'method' },
                { title: 'Employee', key: 'user' },

                { title: 'Actions', key: 'actions', sortable: false },

            ]
            $api.get('/api/expenses/getTransfers').then((res) => {
                const result = res.data.result
                console.log(result)
                processResult(result, 'get').then((res) => {
                    content.value = res
                    loading.value = false
                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occurred'
                    console.log(err.response.data)
                })
            break;
        case 'income':
            tab2.value = 4
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },
                { title: 'Title', key: 'title' },
                { title: 'Type', key: 'type' },
                { title: 'Amount', key: 'amount' },
                { title: 'Method', key: 'method' },
                { title: 'Employee', key: 'user' },

                { title: 'Actions', key: 'actions', sortable: false },

            ]
            $api.get('/api/incomes/getIncomes').then((res) => {
                const result = res.data.result
                
                processResult(result, 'get').then((res) => {
                    content.value = res
                    loading.value = false
                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occurred'
                    console.log(err.response.data)
                })


            break;

        case 'expenses':
            tab2.value = 5
            loading.value = true

            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },
                { title: 'Title', key: 'title' },
                { title: 'Type', key: 'type' },
                { title: 'Amount', key: 'amount' },
                { title: 'Method', key: 'method' },
                { title: 'Employee', key: 'user' },

                { title: 'Actions', key: 'actions', sortable: false },

            ]
            $api.get('/api/expenses/getExpenses').then((res) => {
                const result = res.data.result
                console.log(result)
                processResult(result, 'get').then((res) => {
                    content.value = res
                    loading.value = false
                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occurred'
                    console.log(err.response.data)
                })


            break;


        case 'returned':
            tab2.value = 7
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },

                { title: 'Order Id', key: 'order_no' },
                { title: 'Customer Name', key: 'customer' },
                { title: 'Amount Repaid', key: 'amount' },
                { title: 'No of Items', key: 'no_items' },
                { title: 'Reason ', key: 'reason' },
                { title: 'Received By', key: 'user' },
                { title: 'Actions', key: 'actions', sortable: false },
            ]

            $api.get('/api/returns/getReturns').then((res) => {
                const result = res.data.result
                // console.log(result)
                processResult(result).then((res) => {
                    content.value = res
                    loading.value = false
                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occurred'
                    //console.log(err.response.data)
                })
            break;

            case 'repayment':
            tab2.value = 8
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },
                { title: 'Title', key: 'title' },
                { title: 'Type', key: 'type' },
                { title: 'Amount', key: 'amount' },
                { title: 'Method', key: 'method' },
                { title: 'Employee', key: 'user' },

                { title: 'Actions', key: 'actions', sortable: false },

            ]
            $api.get('/api/incomes/getRepayment').then((res) => {
                const result = res.data.result
                
                processResult(result, 'get').then((res) => {
                    content.value = res
                    loading.value = false
                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occurred'
                    console.log(err.response.data)
                })


            break;

        default:

            break;
    }
}

async function processResult(item, httpMethod?: string) {

    if (httpMethod) {
        configStore.updatePaginator(item, httpMethod)
    } else {
        configStore.updatePaginator(item)
    }



    let i = 1; const result = []
    if (tab2.value == 0) {

        item.data.forEach((el) => {
            let a = {
                'date': new Date(el.created_at).toLocaleTimeString(),
                'title': el.title,
                'amount': configStore.currencyFormatter().format(el.amount),
                'method': el.payment_method,
                'user': usersStore.getUserById.value(el.employee)?.name,
                'reason': el.description,
                'type': el.type,
                'item': el,
            }
            result.push(a)
        })
    } else if (tab2.value == 7) {

        await item.data.forEach((el: Product & any) => {
            const details = JSON.parse(el.details)
            // console.log(item.data)

            let a = {
                'date': new Date(el.ledger_date).toLocaleDateString('en-gb'),

                'order_no': el.order_no,
                'customer': el.name,
                'user': usersStore.getUserById.value(el.employee)?.name,
                'no_items': details.length,
                'amount': configStore.currencyFormatter().format(el.amount_repaid),
                'id': el.order_id,
                'reason': el.reason,

                'item': el,
            }

            result.push(a)
        })

    } else if (tab2.value == 1 || tab2.value > 3) {

        await item.data.forEach((el) => {
            const ac = el.misc ? JSON.parse(el.misc) : ''
            let a = {
                'date': new Date(el.ledger_date).toLocaleDateString('en-gb'),
                'title': el.title,
                'amount': configStore.currencyFormatter().format(el.amount),
                'method': el.payment_method,
                'user': usersStore.getUserById.value(el.employee)?.name,
                'reason': el.description,
                'type': el.type.replace('_', ' '),

                'acct_name': ac.acct_name,
                'acct_no': ac.acct_no,
                'bank': ac.bank,


                'item': el
            }
            result.push(a)
        })

    } else if (tab2.value == 3) {

        item.data.forEach((el) => {
            let a = {
                'sn': i++,
                'product': el.name,
                'product_sku': el.sku,
                'total_sold': parseInt((el.qty).toLocaleString()),
                'gross_total': configStore.currencyFormatter().format(el.gross),
                'profit': configStore.currencyFormatter().format(el.profit),
                'no_items': el.no_items
            }
            result.push(a)
        })
    } else if (tab2.value == 2) {
        item.data.forEach((el) => {
            let a = {
                'date': new Date(el.ledger_date).toLocaleDateString('en-gb'),
                'invoice_no': el.invoice_no,
                'order_no': el.order_no,
                'customer': el.name,
                'total': configStore.currencyFormatter().format(el.total),
                'paid': configStore.currencyFormatter().format(el.amount_paid),
                'due': configStore.currencyFormatter().format(el.remainder),
                'no_items': el.no_items,
                'id': el.id,
                'item': el
            }
            result.push(a)
        })
    }
    //console.log(result); throw new Error('Yeah')
    return result

}

// function download(url) {

// let page = document.getElementById('page')
//     var opt = {
//   margin:       0.5,
//   filename:     'myfile.pdf',
//   image:        { type: 'jpeg', quality: 0.98 },
//   html2canvas:  { scale: 1 },
//   jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
// };

// // New Promise-based usage:
// html2pdf().set(opt).from(page).save();

function download(url) {

let page = document.getElementById('page')

html2PDF(page, {
    jsPDF: {
        format: 'a4',
        orientation: "landscape",
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
            output: `./pdf/${tab.value}.pdf`
    });
}


function normalize() {

    switch (tab2.value) {

        case 0:
            showTable('current')
            break;
        case 3:
            showTable('summary')
            break;

        case 1:
            showTable('timeline')
            break;

        case 2:
            showTable('sales')
            break;

        case 4:
            showTable('income')
            break;

        case 5:
            showTable('expenses')
            break;


        case 6:
            showTable('transfer')
            break;

        case 7:
            showTable('returned')
            break;
        
            case 8:
            showTable('repayment')
            break;

            default:

            showTable('today')
            break;
    }
}

function processItem(item) {
    loading.value = true
    processResult(item).then((res) => {
        content.value = res
        loading.value = false
    })
}


function getUrl(item: string) {
    switch (item) {
        case 'today':
            return {
                'search': '', //'/api/transactions/searchByDate',
                'date': '',
                'range': '',
                'delete': ''
            }
            break;

        case 'returned':
            return {
                'search': 'api/returned/search', //'/api/transactions/searchByDate',
                'date': 'api/returned/getByDate',
                'range': 'api/returned/getByRange',
                'delete': ''
            }

            break;

            case 'repayment':
            return {
                'search': 'api/incomes/searchRepay', //'/api/transactions/searchByDate',
                'date': 'api/incomes/getRepayByDate',
                'range': 'api/incomes/getRepayByRange',
                'delete': ''
            }

            break;

        case 'timeline':
            return {
                'search': '/api/transactions/search',
                'date': '/api/transactions/getByDate',
                'range': '/api/transactions/getByRange',
                'delete': ''
            }
            break;

        case 'summary':
            return {
                'search': 'api/orders/searchSummary',
                'date': 'api/orders/getSalesByDate?summary=true',
                'range': 'api/orders/getSalesByRange?summary=true',
                'delete': ''
            }
            break;

        case 'sales':
            return {
                'search': 'api/orders/search',
                'date': 'api/orders/getSalesByDate',
                'range': 'api/orders/getSalesByRange',
                'delete': ''
            }
            break;

        case 'income':
            return {
                'search': '/api/incomes/searchIncome',
                'date': '/api/incomes/getByDate/',
                'range': '/api/incomes/getByRange/',
                'delete': ''
            }
            break;

        case 'expenses':
            return {
                'search': '/api/expenses/searchExpense',
                'date': '/api/expenses/getByDate',
                'range': '/api/expenses/getByRange',
                'delete': ''
            }
            break;

        case 'transfer':
            return {
                'search': '/api/expenses/searchTransfer',
                'date': '/api/expenses/getTransferByDate',
                'range': '/api/expenses/getTransferByRange',
                'delete': ''
            }
            break;

        default:
            break;
    }
}

//  this.$api.post('api/orders/getSalesByDate', data).then((res) => {        
//  this.$api.post('api/orders/getSalesByRange', data).then((res) => {

/**
* 
* @param searchTerm 

*/


function searchTable(searchTerm) {

    if (!searchTerm) {
        return normalize()
    }

    const url = getUrl(tab.value)?.search
    if (!url) return configStore.alert_msg = 'Error: You can\'t perform this action'

    loading.value = true
    $api.post(url, { 'searchTerm': searchTerm, 'type': tab2.value }).then((res) => {
        //     console.log(res.data)
        const result = res.data.result
        if (res.data.data) {
            result.data = res.data.data
        }

        processResult(result, 'post').then((res) => {
            content.value = res
            loading.value = false
        })
    })
        .catch((err) => {
            configStore.alert_msg = 'An error occured during searching'
            console.log(err)
        })
}


async function getByDate(date) {
    if (!date) { return normalize() }

    const url = getUrl(tab.value)?.date
    if (!url) return configStore.alert_msg = 'Error: You can\'t perform this action'

    loading.value = true

    $api.post(url, { 'start': date }, { headers: { 'Access-Control-Allow-Origin': '*' } }).then((res) => {

        const result = res.data.result
        if (res.data.data) {
            result.data = res.data.data
        }
        processResult(result, 'post').then((res) => {
            content.value = res
            loading.value = false
        })
    })
        .catch((err) => {
            configStore.alert_msg = 'An error occurred'
            console.log(err)
        })
}

async function getByRange(data) {

    const start = data.start_date
    const end = data.end_date

    if (!end || !start) {
        //throw new Error("gtj");

        return normalize()
    }
    const url = getUrl(tab.value)?.range
    if (!url) return configStore.alert_msg = 'Error: You can\'t perform this action'

    $api.post(url, { 'start': start, 'end': end }).then((res) => {

        const result = res.data.result
        console.log(result); console.log(res.data)
        if (res.data.data) {
            result.data = res.data.data
        }

        processResult(result, 'post').then((res) => {
            content.value = res
            loading.value = false
        })
    })
        .catch((err) => {
            configStore.alert_msg = 'An error occurred'
            console.log(err.response.data)
        })
}

function hasPermission(per){
    return usePermissionStore().hasPermission(per)
}

onMounted(() => {
    showTable('today')
})
</script>