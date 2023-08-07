<template>
  <v-sheet class="m-0 m-n2" elevation="6" id="page">
    <v-tabs v-model="tab" v-if="hasPermission(permission)" class="bg-color-black" color="purple-accent-4" align-tabs="center">
      <v-tab value="today" @click="showTable('today')"> Transaction Ledger</v-tab>
    </v-tabs>

    <v-window v-model="tab2">
      <v-window-item :value="0">
        <v-card class="d-flex justify-center align-center">
          <myDataTable @search-by-date="getByDate" @print="download" @search-by-range="getByRange" @search="searchTable"
             @edit="editItem" @delete="deleteItem" @view="showView" @update="processItem" :key="1"
            :loading="loading" :content="content" :headers="header">
          </myDataTable>
        </v-card>
      </v-window-item>

    </v-window>

    <LegderDialog @close="get_crud = false;" :items="product" v-if="get_crud"/>
    <DeleteAlert @submitted="showTable(tab)" />
    
  </v-sheet>
</template>

<script setup lang="ts">
import myDataTable from '~~/components/myDataTable.vue';
import { useConfigStore } from '~~/store/config';
import { useBranchStore } from '~~/store/branchStore';
import { useUsersStore } from '~~/store/users';
import { Product, useProductStore } from '~~/store/productsStore';
import { useStockStore } from '~~/store/stocks';
import { storeToRefs } from 'pinia';
import LegderDialog from '~~/components/legder/legderDialog.vue';
import { usePermissionStore } from '~~/store/permissions';
import html2PDF from 'jspdf-html2canvas';

definePageMeta({
  middleware: [
    function (to, from) {
      const permission = [
      "can_view_ledger","can_edit_ledger","can_delete_ledger"
];
//console.log(usePermissionStore().userpermissions)
      if(to.path == '/ledger' && !usePermissionStore().hasPermission(permission)){
        useConfigStore().alert_msg = 'You dont have access to this page'
        return abortNavigation()
      }
    },
    
  ],
});

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
            output: `./pdf/acct_ledger.pdf`
    });
}


const { $api } = useNuxtApp()
const configStore = useConfigStore()
const branchStore = storeToRefs(useBranchStore())
const usersStore = storeToRefs(useUsersStore())
const productsStore = storeToRefs(useProductStore())
const stocksStore = storeToRefs(useStockStore())

const feature = ref([

  { text: 'New Sales', icon: 'mdi-cart-plus' },
])

const get_transfer = ref(false)
const get_crud = ref(false)
const get_income = ref(false)
const get_expense = ref(false)
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


function showView(item) {
  console.log(item)
  product.value = item
  task.value = 'view'
  if (product.value) {
    get_crud.value = true
  }

}


const permission = [
"can_view_ledger","can_edit_ledger","can_delete_ledger",
]

function hasPermission(per){
  return usePermissionStore().hasPermission(per)
}
function editItem(item) {
  configStore.alert_msg = 'Error, Not editable'
}

function deleteItem(item) {
  configStore.alert_msg = 'Oh, sorry you can\'t delete a ledger'
}

function showTable(page: string, ev?: string) {

  switch (page) {
    case 'today':
      tab2.value = 0

      loading.value = true
      header.value = [
        {
          title: 'Date',
          align: 'start',
          sortable: true,
          key: 'date',
        },
        { title: 'Id', key: 'ledger_id' },
        { title: 'Opening Cash', key: 'opening' },
        
        { title: 'Total Sales', key: 'sales' },
        { title: 'Other Income', key: 'income' },
        { title: 'Credit/Expense', key: 'debit' },

        { title: 'Closing Cash', key: 'closing' },
        { title: 'Closed By', key: 'user' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions', sortable: false },
      ]

      $api.get('/api/registry/getRegisters').then((res) => {
        const result = res.data.result
        if (res.data.data) {
          result.data = res.data.data
        }

        console.log(result)
        processResult(result, 'get').then((res) => {
          content.value = res
          loading.value = false
        })
      })
        .catch((err) => {
          console.log(err.response)
          configStore.alert_msg = 'An error occurred'
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

  item.data.forEach(el => {
    let a = {
    'date': new Date(el.time_opened).toLocaleDateString('en-gb'),
    'opening': configStore.currencyFormatter().format(el.opening_amt),
    'sales': configStore.currencyFormatter().format(el.total_sales),
    'income': configStore.currencyFormatter().format(el.total_income),
    'debit': configStore.currencyFormatter().format(el.total_exp),
    'closing': configStore.currencyFormatter().format(el.closing_amt),
    'user': usersStore.getUserById.value(el.closed_by)?.name,
    'ledger_id': el.reg_code,
    'status': el.status == 0 ? 'active' : 'closed',
    'item': el
  }

  result.push(a)

})

  //console.log(result); throw new Error('Yeah')
  return result

}

function normalize() {
  switch (tab2.value) {
    case 0:
      showTable('today')
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
        'search': 'api/registry/searchRegistry',
        'date': '/api/registry/getByDate',
        'range': '/api/registry/getByRange',
        'delete': ''
      }

    case 'timeline':
      return {
        'search': '/api/transactions/search',
        'date': '/api/transactions/getByDate',
        'range': '/api/transactions/getByRange',
        'delete': ''
      }

    case 'summary':
      return {
        'search': 'api/orders/searchSummary',
        'date': 'api/orders/getSalesByDate?summary=true',
        'range': 'api/orders/getSalesByRange?summary=true',
        'delete': ''
      }

    case 'sales':
      return {
        'search': 'api/orders/search',
        'date': 'api/orders/getSalesByDate',
        'range': 'api/orders/getSalesByRange',
        'delete': ''
      }

    case 'income':
      return {
        'search': '/api/incomes/searchIncome',
        'date': '/api/incomes/getByDate/',
        'range': '/api/incomes/getByRange/',
        'delete': ''
      }

    case 'expenses':
      return {
        'search': '/api/expenses/searchExpense',
        'date': '/api/expenses/getByDate',
        'range': '/api/expenses/getByRange',
        'delete': ''
      }

    case 'transfer':
      return {
        'search': '/api/expenses/searchTransfer',
        'date': '/api/expenses/getTransferByDate',
        'range': '/api/expenses/getTransferByRange',
        'delete': ''
      }

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
    console.log(res.data)
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
      //console.log(err.response.data)
    })
}


onMounted(() => {
  showTable('today')
})
</script>