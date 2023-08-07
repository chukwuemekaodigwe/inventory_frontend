<template>
    <client-only>

        <v-data-table-server v-model:items-per-page="configStore.tablePager.perPage" :headers="headers" id="pages"
            :items-length="totalItems" :items="content" :loading="loading" :search="search" class="elevation-1"
            item-value="name" @update:page="getPage" @update:itemsPerPage="changePerPage">
            <!-- @update:options="loadMore" -->
            <template v-slot:top>
                <v-toolbar density="compact" class="pl-4">

                    <v-text-field v-if="!search" type="date" clearable label="Start Date" v-model="searchByDate.start_date"
                        @update:model-value="$emit('searchByDate', searchByDate.start_date)" hide-details>
                    </v-text-field>

                    <v-text-field v-if="!search" type="date" clearable label="End Date" v-model="searchByDate.end_date"
                        @update:model-value="$emit('searchByRange', searchByDate)" hide-details></v-text-field>

                    <v-text-field @click:clear="search = false; emit('search', '')" clearable autofocus v-model="search1"
                        style="transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1);" v-if="search" variant="underlined"
                        single-line label="Search" hide-details>
                    </v-text-field>
                    <v-btn icon size="small" @click="searchTable" v-if="!selected">
                        <v-icon v-if="!search">mdi-magnify</v-icon> <span v-else>
                            <v-icon>mdi-send</v-icon>
                        </span>
                    </v-btn>

                    <v-btn v-else icon size="small" @click="emit('selected', approve); approve = []" class="bg-success">
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                    <!-- @click="printJS('page', 'html')">  -->
                    <v-btn icon size="small" @click="emit('print', page)">
                        <v-icon>mdi-printer</v-icon>
                    </v-btn>
                    <v-menu v-if="hasPermission(permissions.add)">
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                        </template>

                        <v-list>
                            <v-list-item v-for="(item, i) in items" :key="i" @click="$emit('feature', item.text)"
                                :value="item" color="primary" nav>
                                <template v-slot:prepend>
                                    <v-icon :icon="item.icon"></v-icon>
                                </template>
                                <v-list-item-title v-text="item.text"></v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                </v-toolbar>
            </template>

            <template v-slot:item.select="{ item }">
                <v-checkbox-btn density="compact" class="w-50 text-center" variant="underlined" :value="item.raw.id"
                    @input="approveItem(item.raw.id)" v-model="item.raw.select"></v-checkbox-btn>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-icon color="black" size="small" v-if="hasPermission(permissions.view)" class="me-2"
                    @click="$emit('view', item.raw)">
                    mdi-eye
                </v-icon>
                <v-icon size="small" color="info" class="me-2" @click="$emit('edit', item.raw)"
                    v-if="hasPermission(permissions.edit)">
                    mdi-pencil
                </v-icon>
                <v-icon size="small" color="red" @click="$emit('delete', item.raw)"
                    v-if="hasPermission(permissions.delete)">
                    mdi-delete
                </v-icon>
            </template>

        </v-data-table-server>
    </client-only>
</template>

<script setup lang="ts">
import printJS from 'print-js'
import jsPDF from 'jspdf'
import jspdfAutoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'
import html2PDF from 'jspdf-html2canvas';


import { useConfigStore } from '~~/store/config'
import { usePermissionStore } from '~~/store/permissions'

const { $api } = useNuxtApp()

const configStore = useConfigStore()
const emit = defineEmits(['view', 'edit', 'print', 'delete', 'search', 'feature', 'searchByDate',
    'searchByRange', 'update', 'changePage', 'perPage', 'selected', 'submitted'])

const props = defineProps(['loading', 'headers', 'content', 'feature', 'perPage'])
const perpage = ref(props.perPage ? props.perPage : 10)
//const itemsPerPage = computed(() => configStore.tablePager.perPage)
const headers = computed(() => props.headers ? props.headers : '')
const content = computed(() => props.content ? props.content : '')
const search = ref(false)
const search1 = ref('')
const loading = computed(() => props.loading ? props.loading : false)

const totalItems = computed(() => configStore.tablePager.totalItems)
const searchTable = () => {
    if (!search.value) {
        (search.value = true)

    } else {
        emit('search', search1.value);

    }
}


function approveItem(id) {
    const a = approve.value
    if (a.includes(id)) {
        const i = a.findIndex(el => el == id)
        a.splice(i, 1)
    } else {
        a.push(id)
    }
}


const approve = ref([])
const selected = computed(() => approve.value.length > 0 ? true : false)
const searchByDate = reactive({
    start_date: '',
    end_date: '',
    loaded: false
})

const items = props.feature

function getColor(item: number) {
    let color = ''
    if (item == 1) {
        color = 'tertiary'
    } else if (item == 2) {
        color = 'info'
    } else {
        color = 'warning-darken-2'
    }

    return color
}


function getStatus(id: number) {
    if (id == 1) {
        return { 'color': 'info', 'name': 'received' }
    } else if (id == 0) {
        return { 'color': 'error', 'name': 'pending' }
    }
}


const permissions = {
    'view': [
        "can_view_income", "can_view_fund_transfer", "can_view_sales",
        "can_view_stock", "can_view_expenses", "can_view_payments", "can_view_sales",
        "can_view_ledger", "can_view_product_returns", "can_view_others_records",
        "can_view_branch_records", "can_view_all_records",
    ],

    'edit': [
        "can_edit_income", "can_edit_fund_transfer", "can_edit_sales",
        "can_edit_stock", "can_edit_expenses", "can_edit_payments", "can_edit_sales",
        "can_edit_ledger", "can_edit_product_returns", "can_edit_others_records",
        "can_edit_branch_records", "can_edit_all_records",
    ],

    'delete': [
        "can_delete_income", "can_delete_fund_transfer", "can_delete_sales",
        "can_delete_stock", "can_delete_expenses", "can_delete_payments", "can_delete_sales",
        "can_delete_ledger", "can_delete_product_returns", "can_delete_others_records",
        "can_delete_branch_records", "can_delete_all_records",
    ],
    'add': [
        "can_add_income", "can_add_fund_transfer", "can_add_sales",
        "can_add_stock", "can_add_expenses", "can_add_payments", "can_add_sales",
        "can_add_ledger", "can_add_product_returns", "can_add_others_records",
        "can_add_branch_records", "can_add_all_records",
    ]
}

function hasPermission(per) {
    return usePermissionStore().hasPermission(per)
}

const page = ref(null)

function downloadPdf() {
    //const doc = new jsPDF()
    //console.log(doc)
    //doc.autoTable({ html: '#page' })
    // autoTable(doc, { html: '#page' })


    let doc = new jsPDF('p', 'pt');

    doc.html('#page')

    doc.save('teste.pdf');


}


function downloadWithCSS() {
    const doc = new jsPDF();
    /** WITH CSS */
    var canvasElement = document.createElement('canvas');

    html2canvas(document.getElementById('page'), {
        canvas: canvasElement
    }).then(function (canvas) {
        const img = canvas.toDataURL("image/jpeg", 0.8);
        doc.addImage(img, 'JPEG', 20, 20);
        console.log(doc)
        doc.save("sample.pdf");
    });
}

function getPage(page: number) {
    const url = `${configStore.tablePager.pageUrl}?page=${page}`
    loadMore(url)
}

function changePerPage(perPage: number) {
    const url = `${configStore.tablePager.pageUrl}?per-page=${perPage}`
    loadMore(url)
}


function loadMore(url) {
    if (configStore.tablePager.httpMethod == 'post') {

        $api.post(url, { 'searchKey': search, 'start': searchByDate.start_date, 'end': searchByDate.end_date }).then((res) => {
            const result = res.data.result
            configStore.updatePaginator(result)
            emit('update', result)
            //           console.log({ 'inside': result })
        })
            .catch((err) => {
                configStore.alert_msg = 'An error occured'
                console.log(err)
            })
    } else {
        $api.get(url).then((res) => {
            const result = res.data.result
            configStore.updatePaginator(result)

            emit('update', result)
            console.log(result)
        })
            .catch((err) => {
                configStore.alert_msg = 'An error occured'
                console.log(err)
            })
    }

}



//}

</script>
<style>
@media print{
    .v-data-table__td .v-icon {
        display: none!important;
    }
}
</style>

 