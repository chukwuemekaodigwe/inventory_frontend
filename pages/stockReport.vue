<template>
    <v-sheet class="m-0 m-n2" elevation="6" id="page">
        <v-tabs v-model="tab" color="purple-accent-4" align-tabs="center">
            <v-tab value="current" v-if="hasPermission(permissions.current)" @click="showTable('current')">Current
                Stock</v-tab>
            <v-tab v-if="hasPermission(permissions.timeline)" value="timeline" @click="showTable('timeline')">Stocks
                Timeline</v-tab>
            <v-tab v-if="hasPermission(permissions.pending)" value="pending" @click="showTable('pending')">Pending Transfer
            </v-tab>
            <v-tab value="transfer" v-if="hasPermission(permissions.transfer)" @click="showTable('transfer')">Transfered
                Stock</v-tab>
            <v-tab value="removed" v-if="hasPermission(permissions.removed)" @click="showTable('removed')">Removed
                Stock</v-tab>

        </v-tabs>

        <v-window v-model="tab2">
            <v-window-item :value="0">
                <v-card class="d-flex justify-center align-center">
                    <myDataTable :feature="feature" @search-by-date="getStockByDate" @search-by-range="getStockByRange"
                        @search="searchStock" @feature="getFeature" @edit="editItem" @delete="deleteItem" @view="showView"
                        @update="processItem" :key="1" @print="download('page')" :loading="loading" :content="content"
                        :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="1">
                <v-card class="d-flex justify-center align-center" id="page2">
                    <myDataTable :feature="feature" @print="download('page2')" @search-by-date="getStockByDate"
                        @search-by-range="getStockByRange" @search="searchStock" @feature="getFeature" @edit="editItem"
                        @delete="deleteItem" @view="showView" @update="processItem" :key="2" :loading="loading"
                        :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="2">
                <v-card class="d-flex justify-center align-center" id="page3">
                    <myDataTable :feature="feature" @print="download('page3')" @search-by-date="getStockByDate"
                        @search-by-range="getStockByRange" @search="searchStock" @feature="getFeature" @edit="editItem"
                        @delete="deleteItem" @view="showView" @update="processItem" :key="3" :loading="loading"
                        :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="3">
                <v-card class="d-flex justify-center align-center" id="page4">
                    <myDataTable :feature="feature" @search-by-date="getStockByDate" @print="download('page4')"
                        @search-by-range="getStockByRange" @search="searchStock" @feature="getFeature" @edit="editItem"
                        @delete="deleteItem" @view="showView" @update="processItem" :key="4" :loading="loading"
                        :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

            <v-window-item :value="4">
                <v-card class="d-flex justify-center align-center" id="page5">
                    <myDataTable :feature="feature" @search-by-date="getStockByDate" @search-by-range="getStockByRange"
                        @search="searchStock" @print="download('page5')" @selected="approveItem" @feature="getFeature"
                        @edit="editItem" @delete="deleteItem" @view="showView" @update="processItem" :key="2"
                        :loading="loading" :content="content" :headers="header">
                    </myDataTable>
                </v-card>
            </v-window-item>

        </v-window>


        <DeleteAlert @submitted="showTable(tab)" />
        <LazyStocksEditStock :product="product" v-if="get_edit" @close="get_edit = false; showTable(tab);" />
        <LazyStocksViewStock :product="product" v-if="get_view" @close="get_view = false; showTable(tab)" />
        <LazyStocksTransferStock v-if="get_transfer" @close="get_transfer = false; showTable(tab)" />
        <StocksViewTransferredStock v-if="get_transferred" :product="product"
            @close="get_transferred = false; showTable(tab)" />
        <LazyStocksAddStock v-if="get_add" @close="get_add = false; showTable(tab)" />
        <LazyStocksChangePrice v-if="get_price" @close="get_price = false; showTable(tab)" />
        <LazyStocksRemoveStock v-if="get_remove" @close="get_remove = false; showTable(tab)" />
        <TransactionViewReturnSale v-if="get_return" @close="get_return = false" :product="product" />
    </v-sheet>
</template>

<script setup lang="ts">
import myDataTable from '~~/components/myDataTable.vue';
import {formatNumber} from '../composables/getFilters'
import { useConfigStore } from '~~/store/config';
import { useBranchStore } from '~~/store/branchStore';
import { useUsersStore } from '~~/store/users';
import { Product, useProductStore } from '~~/store/productsStore';
import { useStockStore } from '~~/store/stocks';
import { storeToRefs } from 'pinia';
import { usePermissionStore } from '~~/store/permissions';
import html2PDF from 'jspdf-html2canvas';
import html2pdf from 'html2pdf.js'
import printJs from 'print-js'
const { $api } = useNuxtApp()
const configStore = useConfigStore()
const branchStore = storeToRefs(useBranchStore())
const usersStore = storeToRefs(useUsersStore())
const productsStore = storeToRefs(useProductStore())
const stocksStore = storeToRefs(useStockStore())
const selected = []
const feature = ref([
    { text: 'Add Stock', icon: 'mdi-database-plus' },
    { text: 'Remove Stock', icon: 'mdi-database-minus' },
    { text: 'Transfer Stock', icon: 'mdi-reply-all' },
    { text: 'Change Product Price', icon: 'mdi-cash' },
])


function download(url) {

    let page = document.getElementById('page')
    //     var opt = {
    //   margin:       0.5,
    //   filename:     'myfile.pdf',
    //   image:        { type: 'jpeg', quality: 0.98 },
    //   html2canvas:  { scale: 1 },
    //   jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
    // };

    // // New Promise-based usage:
    // html2pdf().set(opt).from(page).save();

    html2PDF(page, {
        jsPDF: {
            format: 'a4',
            orientation: "landscape",
        },
        watermark({ pdf, pageNumber, totalPageNumber }) {
            // pdf: jsPDF instance
            pdf.setFontSize(8)
            pdf.setTextColor('#000');
            pdf.text(6, pdf.internal.pageSize.height - 5, `Watermark, page: ${pageNumber}/${totalPageNumber}`);
        },
        
        margin:{
            bottom : 14,
        },
            imageType: 'image/jpeg',
                output: './pdf/generate.pdf'
        });
}


definePageMeta({
    middleware: [
        function (to, from) {
            const permission = [
                "can_add_stock", "can_view_stock", "can_edit_stock", "can_delete_stock",
            ]

            if (!usePermissionStore().hasPermission(permission)) {
                useConfigStore().alert_msg = 'You dont have access to this page'
                return abortNavigation()
            }
        },

    ],
});


const get_edit = ref(false)
const get_view = ref(false)
const get_remove = ref(false)
const get_price = ref(false)
const get_transferred = ref(false)
const get_transfer = ref(false)
const get_add = ref(false)
const get_return = ref(false)
const product = ref()
const tab = ref('current')
const tab2 = ref(0)
const loading = ref(false)
const header = ref([{}])
const content = ref([{}])

function hasPermission(per) {
    return usePermissionStore().hasPermission(per)
}

function approveItem(id) {

    $api.post('/api/stocks/approveTransfer', { 'stocks': id }).then((res) => {
        console.log(res.data)
        configStore.alert_msg = 'Successfully approved'
        normalize()
    })
        .catch((err) => {
            console.log(err)
            configStore.alert_msg = 'An error occured'
        })
}


function getFeature(item) {

    if (item.includes('Add')) {

        get_add.value = true
    } else if (item.includes('Transfer')) {

        get_transfer.value = true
    } else if (item.includes('Change')) {

        get_price.value = true
    } else if (item.includes('Remove')) {

        get_remove.value = true
    }
}

function showView(item) {
    product.value = item
    if (item.type.includes('transfer')) {
        get_transferred.value = true

    } else if (tab2.value == 4) {

        get_return.value = true
    } else {
        get_view.value = true
    }

}

function editItem(item) {
    product.value = item
    if (tab2.value == 2) {
        get_transferred.value = true

    } else {
        get_edit.value = true
    }
}

function deleteItem(item) {
    console.log(item)
    const url = `/api/stocks/deleteStock/${item.id}`
    configStore.delete_alert = url
}


function showTable(page: string) {
    switch (page) {
        case 'current':
            tab2.value = 0
            configStore.tablePager.perPage = 30
            loading.value = true
            header.value = [
                {
                    title: 'S/N',
                    align: 'start',
                    sortable: true,
                    key: 'serial',
                },
                { title: 'Product Name', key: 'name' },
                { title: ' SKU', key: 'sku' },
                { title: 'Quantity ', key: 'inStockQty' },
                { title: 'Unit', key: 'units' },
                { title: 'Purchase Price', key: 'costprice' },
                { title: 'Selling price', key: 'sellingprice' },
                { title: 'Alert Level', key: 'alert_level' },
            ]

            $api.get('/api/stocks/getStockQty').then((res) => {
                const results = res.data.result
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

                { title: 'product', key: 'product' },
                { title: 'sku', key: 'sku' },
                { title: 'Stock Type', key: 'type' },
                { title: 'Quantity', key: 'no_items' },
                { title: 'Approved', key: 'user' },
                { title: 'Note', key: 'reason' },
                { title: 'StockId', key: 'stock_id' },
                { title: 'Actions', key: 'actions', sortable: false },

            ]


            $api.get('/api/stocks/getStockHistory/').then((res) => {
                //  console.log(res.data)
                const result = res.data.result
                processResult(result, 'get').then((res) => {
                    loading.value = false
                    content.value = res

                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occurred'
                    // console.log(err)
                })
            break;

        case 'transfer':
            tab2.value = 2
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },
                { title: 'product', key: 'product' },
                { title: 'sku', key: 'sku' },
                { title: 'Quantity', key: 'no_items' },
                { title: 'Transferred From', key: 'from_branch' },
                { title: 'To', key: 'title' },
                { title: 'Status', key: 'status' },
                { title: 'Actions', key: 'actions', sortable: false },
            ]

            $api.get('/api/stocks/getTransferredStock').then((res) => {
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

        case 'removed':
            tab2.value = 3
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },
                { title: 'product', key: 'product' },
                { title: 'sku', key: 'sku' },
                { title: 'Quantity', key: 'no_items' },
                { title: 'Removed By', key: 'user' },
                { title: 'Reason ', key: 'reason' },
                { title: 'Actions', key: 'actions', sortable: false },
            ]

            $api.get('/api/stocks/getRemovedStock').then((res) => {
                const result = res.data.result
                //.log(result)
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


        case 'pending':
            tab2.value = 4
            loading.value = true
            header.value = [
                {
                    title: 'Date',
                    align: 'start',
                    sortable: true,
                    key: 'date',
                },

                { title: 'product', key: 'product' },
                { title: 'sku', key: 'sku' },
                { title: 'Quantity', key: 'no_items' },
                { title: 'Transferred From', key: 'from_branch' },
                { title: 'Sent By', key: 'user' },
                { title: 'Approve', key: 'select' },

            ]

            $api.get('/api/stocks/getPendingTransfer').then((res) => {
                const result = res.data.result

                processResult(result, 'get').then((res) => {
                    content.value = res
                    loading.value = false
                })
            })
                .catch((err) => {
                    configStore.alert_msg = 'An error occurred'

                })
            break;

        default:

            break;

    }
}

async function processResult(item, httpMethod = '') {

    configStore.updatePaginator(item, httpMethod = '')
    let i = 1; const result = []

    if (tab2.value == 4) {
        await item.data.forEach((el: Product & any) => {

            let a = {
                'date': new Date(el.updated_at).toLocaleDateString('en-gb'),

                'product': el.name,
                'sku': el.sku,
                'user': usersStore.getUserById.value(el.registered_by)?.name,
                'no_items': el.qty < 0 ? formatNumber((el.qty * -1), 7) : formatNumber(el.qty, 7),
                'from_branch': branchStore.getBranchById.value(el.from)?.title,
                'id': el.id,
                'item': el,
            }

            result.push(a)
        })

    }

    else if (tab2.value == 0) {
        await item.data.forEach((el: Product & any) => {
            let a = {
                'serial': i++,
                'name': el.name,
                'sku': el.sku,
                'inStockQty': el.stockQty - el.salesQty,
                'units': el.units,
                'costprice': el.costprice,
                'sellingprice': el.sellingprice,
                'alert_level': el.alert_level,
                'product': el.id
            }
            result.push(a)
        })
    } else {

        await item.data.forEach((el) => {
            const types = ['purchased', 'transfer', 'removed', 'returned']
            //const typename = (el.type == 1) ? 'PURCHASE' : ((el.type == 2) ? 'TRANSFER' : 'REMOVAL')
            let a = {
                'date': new Date(el.updated_at).toLocaleDateString('en-gb'),
                'type': types[el.type - 1],
                'product': el.name,
                'sku': el.sku,
                'user': usersStore.getUserById.value(el.registered_by)?.name,
                'no_items': el.qty < 0 ? (formatNumber(el.qty * -1), 7) : formatNumber(el.qty, true),
                'product_id': el.product_id,
                'id': el.id,
                'reason': el.brief_note,
                'stock_id': el.stockId,
                'item': el,
            }

            if (tab.value == 'transfer') {
                const b = {
                    'title': branchStore.getBranchById.value(el.branch_id)?.title,
                    'branch': el.branch_id,
                    'from_branch': branchStore.getBranchById.value(el.from)?.title,
                    'status': el.status == 1 ? 'received' : 'pending'
                }
                //console.log(a);
                a = { ...a, ...b }
            }

            result.push(a)
        })

    }
    //console.log(result); throw new Error('Yeah')
    return result

}

function normalize() {
    switch (tab2.value) {
        case 0:
            showTable('current')
            break;
        case 1:
            showTable('timeline')
            break;

        case 2:
            showTable('transfer')
            break;

        case 3:
            showTable('removed')
            break;

        case 4:
            showTable('pending')
            break;

        default:
            showTable('current')
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
        case 'current':
            return {
                'search': '',
                'date': '',
                'range': '',
                'delete': ''
            }
            break;


        case 'timeline':
            return {
                'search': '/api/stocks/searchStock',
                'date': '/api/stocks/getByDate',
                'range': '/api/stocks/getByRange',
                'delete': ''
            }
            break;

        case 'transfer':
            return {
                'search': '/api/stocks/searchStock',
                'date': '/api/stocks/getByDate',
                'range': '/api/stocks/getByRange',
                'delete': ''
            }
            break;

        case 'removed':
            return {
                'search': '/api/stocks/searchStock',
                'date': '/api/stocks/getByDate',
                'range': '/api/stocks/getByRange',
                'delete': ''
            }
            break;
        case 'pending':
            return {
                'search': '/api/stocks/searchStock',
                'date': '/api/stocks/getByDate',
                'range': '/api/stocks/getByRange',
                'delete': ''
            }
            break;
    }
}


function searchStock(searchTerm) {
    if (!searchTerm) {
        return normalize()
    }
    const url = getUrl(tab.value)?.search
    if (!url) return configStore.alert_msg = 'Error: You can\'t perform this action'

    loading.value = true

    $api.post(url, { 'searchKey': searchTerm, 'type': tab2.value }).then((res) => {
        const result = res.data.result
        console.log(res.data)
        processResult(result, 'post').then((res) => {
            content.value = res
            loading.value = false
        })
    })
        .catch((err) => {
            configStore.alert_msg = 'an error occured during searching'
            console.log(err)
        })
}

async function getStockByDate(date) {
    if (!date) { return normalize() }
    const url = getUrl(tab.value)?.date
    if (!url) return configStore.alert_msg = 'Error: You can\'t perform this action'

    loading.value = true
    if (tab2.value == 0) return
    $api.post(url, { 'start': date, 'type': tab2.value }).then((res) => {

        const result = res.data.result
        //console.log(result)
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


async function getStockByRange(data) {

    const start = data.start_date
    const end = data.end_date

    if (!end || !start) {
        return normalize()
    }

    const url = getUrl(tab.value)?.range
    if (!url) return configStore.alert_msg = 'Error: You can\'t perform this action'

    $api.post(url, { 'start': start, 'end': end, 'type': tab2.value }).then((res) => {
        // console.log(res.data)
        //  const result = res.data.result
        processResult(result, 'post').then((res) => {
            content.value = res
            loading.value = false
        })
    })
        .catch((err) => {
            configStore.alert_msg = 'An error occurred'
            //console.log(err.response.data)
        })
}

const permissions = {
    'current': [
        'can_add_stock', 'can_view_stock', 'can_edit_stock', 'can_delete_stock', "can_add_branch_records", "can_view_branch_records", "can_edit_branch_records", "can_delete_branch_records", "can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records"
    ],
    'timeline': [
        'can_add_stock', 'can_view_stock', 'can_edit_stock', 'can_delete_stock', "can_add_branch_records", "can_view_branch_records", "can_edit_branch_records", "can_delete_branch_records", "can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records"
    ],
    'pending': [
        'can_add_stock', 'can_view_stock', 'can_edit_stock', 'can_delete_stock', "can_add_branch_records", "can_view_branch_records", "can_edit_branch_records", "can_delete_branch_records", "can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records"
    ],
    'transfer': [
        'can_add_stock', 'can_view_stock', 'can_edit_stock', 'can_delete_stock', "can_add_branch_records", "can_view_branch_records", "can_edit_branch_records", "can_delete_branch_records", "can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records"
    ],
    'removed': [
        'can_add_stock', 'can_view_stock', 'can_edit_stock', 'can_delete_stock', "can_add_branch_records", "can_view_branch_records", "can_edit_branch_records", "can_delete_branch_records", "can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records"
    ]
}
onMounted(() => {
    showTable('current')
})
</script>