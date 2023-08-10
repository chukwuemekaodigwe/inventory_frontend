<template>
  <v-container>

    <v-overlay :model-value="!loaded" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>


    <v-container>
      <v-row v-if='hasPermission([
        "can_add_company_details","can_view_company_details","can_edit_company_details","can_delete_company_details","can_add_all_records","can_view_all_records","can_edit_all_records","can_delete_all_records",
        "can_view_others_records","can_edit_others_records","can_delete_others_records","can_add_branch_records","can_view_branch_records","can_edit_branch_records","can_delete_branch_records",
      ])'>
        <v-col cols="12" class="mb-n3 pb-n3 d-flex justify-end">
          <div>
            <v-switch label="Change to Month View" class="text-tertiary-lighten-1" :model-value="true" v-model="byMonth"
              @input="loadperMonth"></v-switch>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6"  md="6" lg="3">
          <v-card elevation="3" prepend-icon="mdi-cart" rounded="lg" min-height="150" color="primary" class="">
            <v-card-title class="text-h4"> {{ configStore.currencyFormatter().format(summary.sales) }}</v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class="">Today's Sales</v-card-subtitle>

          </v-card>
        </v-col>

        <v-col cols="12" sm="6"  md="6" lg="3">
          <v-card elevation="3" prepend-icon="mdi-cart" rounded="lg" min-height="150" color="tertiary-darken-1" class="">
            <v-card-title class="text-h4"> {{ configStore.currencyFormatter().format(summary.income) }}</v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class="">Today's Total Income</v-card-subtitle>

          </v-card>
        </v-col>

        <v-col cols="12" sm="6"  md="6" lg="3">
          <v-card elevation="3" prepend-icon="mdi-cart" rounded="lg" min-height="150" color="primary-darken-1" class="">
            <v-card-title class="text-h4"> {{ summary.count.toLocaleString('en-gb') }} </v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class="">N&otilde; of Sales</v-card-subtitle>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6"  md="6" lg="3">
          <v-card elevation="3" prepend-icon="mdi-cart" rounded="lg" min-height="150" color="tertiary-lighten-2" class="">
            <v-card-title class="text-h4"> {{ reg_date }}</v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class="">Active Acct Ledger</v-card-subtitle>

          </v-card>
        </v-col>

      </v-row>
      <v-row>
        <v-col sm="6">

          <ChartsChart3  v-if="loaded" :data="chartData" />
        
        </v-col>
        <v-col sm="6">
          <ChartsChart4 v-if="loaded" :data="chartData" />
        </v-col>
        </v-row>
        <v-row>
        <v-col sm="6">
        <Charts v-if="loaded" :data="chartData" />
        
      </v-col>

      <v-col sm="6">
        <ChartsChart2 v-if="loaded" :data="chartData" />
      </v-col>
      
      </v-row>
      
      <v-row>
        <v-col cols="6" md="3" lg="2" v-if="hasPermission(['can_add_sales'])">
          <v-card variant="outlined" elevation="3" href="/store" rounded="lg" min-height="150" color="tertiary-darken-1"
            class="">
            <v-card-title class="text-h4"> <v-icon icon="mdi-cart-plus"></v-icon> </v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class="">Add Sales</v-card-subtitle>

          </v-card>
        </v-col>

        <v-col cols="6" md="3" lg="2" v-if="hasPermission(['can_add_payment'])">
          <v-card variant="outlined" @click="accept_repay = true;" elevation="3" rounded="lg" min-height="150"
            color="tertiary-darken-1" class="">
            <v-card-title class="text-h4"> <v-icon icon="mdi-clipboard-arrow-down"></v-icon> </v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class=""> Accept Debt Payment</v-card-subtitle>
          </v-card>
        </v-col>

        <v-col cols="6" md="3" lg="2" v-if="hasPermission(['can_add_income'])" >
          <v-card variant="outlined" @click="get_income = true;" elevation="3" rounded="lg" min-height="150"
            color="tertiary-darken-1" class="">
            <v-card-title class="text-h4"> <v-icon icon="mdi-cash-plus"></v-icon> </v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class="">Add Income</v-card-subtitle>
          </v-card>
        </v-col>

        <v-col cols="6" md="3" lg="2" v-if="hasPermission(['can_add_expenses'])">
          <v-card variant="outlined" @click="get_expense = true;" elevation="3" rounded="lg" min-height="150"
            color="tertiary-darken-1" class="">
            <v-card-title class="text-h4"> <v-icon icon="mdi-cash-minus"></v-icon> </v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class=""> Add Expenses</v-card-subtitle>

          </v-card>
        </v-col>


        <v-col cols="6" md="3" lg="2" v-if="hasPermission(['can_add_fund_transfer'])">
          <v-card variant="outlined" @click="get_transfer = true;" elevation="3" rounded="lg" min-height="150"
            color="tertiary-darken-1" class="">
            <v-card-title class="text-h4"> <v-icon icon="mdi-reply-all"></v-icon> </v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class=""> Add Fund Transfer</v-card-subtitle>

          </v-card>
        </v-col>


        <v-col cols="6" md="3" lg="2" v-if="hasPermission(['can_add_product_returns'])">
          <v-card variant="outlined" @click="add_return = true;" elevation="3" rounded="lg" min-height="150"
            color="tertiary-darken-1" class="">
            <v-card-title class="text-h4" color="text-success-darken-1"> <v-icon icon="mdi-baby-buggy"></v-icon>
            </v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class=""> Add Return Sales</v-card-subtitle>

          </v-card>
        </v-col>

        <v-col cols="6" md="3" lg="2" v-if="hasPermission(['can_add_stock'])">
          <v-card variant="outlined" @click="add_stock = true;" elevation="3" rounded="lg" min-height="150"
            color="tertiary-darken-1" class="">
            <v-card-title class="text-h4"> <v-icon icon="mdi-database-plus"></v-icon> </v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class=""> Add Stock</v-card-subtitle>

          </v-card>
        </v-col>


        <v-col cols="6" md="3" lg="2" v-if="hasPermission(['can_add_product'])">
          <v-card variant="outlined" href="/product" elevation="3" rounded="lg" min-height="150" color="tertiary-darken-1"
            class="">
            <v-card-title class="text-h4"> <v-icon icon="mdi-database-plus"></v-icon> </v-card-title>
            <v-divider thickness="2" class="mb-2"></v-divider>
            <v-card-subtitle class=""> Add Product</v-card-subtitle>

          </v-card>
        </v-col>

        <v-col cols="12" sm="12" md="12" lg="8">
          <v-card elevation="3" rounded="lg" min-height="150" color="warning"
            class="d-flex flex-column pa-1">
            <v-card-title class="d-flex flex-row align-center justify-center pt-5 pb-n2">
              <v-icon icon="mdi-alarm" class="text-h2"></v-icon>
              <span class="font-weight-bold">
                Due 12/12/2022
              </span>
            </v-card-title>
            <v-card-actions>
              <v-btn rounded href="/subscription" v-if='hasPermission([
"can_add_subscription","can_view_subscription","can_edit_subscription","can_delete_subscription",
              ])' size="large" class="py-2 px-3 mx-auto" variant="outlined">Renew Subscription</v-btn>
            </v-card-actions>

          </v-card>
        </v-col>

      </v-row>
      <v-row>
        <v-col cols="12" sm="12">
          <v-sheet class="pa-2" elevation="4" :loading=loading min-height="268">
            <v-card-title clas="text-subtitle">Today's Sales</v-card-title>
            <simpleDataTable :headers="sales_record.headers" :content="sales_record.content" />

          </v-sheet>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="12">
          <v-sheet class="pa-2" elevation="4" :loading=loading min-height="268">
            <v-card-title class="text-subtitle"> List of deptors</v-card-title>
            <simpleDataTable :headers="deptors.headers" :content="deptors.content" />
          </v-sheet>
        </v-col>
      </v-row>

    </v-container>
    <StocksAddStock v-if="add_stock" @close="add_stock = false" />
    <TransactionNewTransfer v-if="get_transfer" @close="get_transfer = false" />
    <TransactionNewExpenses v-if="get_expense" @close="get_expense = false" />
    <TransactionNewIncome v-if="get_income" @close="get_income = false" />
<TransactionDebtRepayment v-if="accept_repay" @close="accept_repay = false" />
    <TransactionReturnSale v-if="add_return" @close="add_return = false"/>
 
 </v-container>
</template>

<script setup>
import { useConfigStore } from '~~/store/config';

import { useNoticeStore } from '~~/store/notifications';
import { useStockStore } from '~~/store/stocks';
import {usePermissionStore } from '../store/permissions'


const { $api } = useNuxtApp()

const configStore = useConfigStore();
const stockStore = useStockStore()
const loading = ref(false)
const loaded = ref(false)
const byMonth = ref($api.defaults.headers.common.recordByMonth ? $api.defaults.headers.common.recordByMonth : false)
const sales = ref({})
const revenues = ref([])
const payments = ref([])
const stocks = ref([])
const data = ref([])
const sales_record = ref({})
const get_chart = ref(false)
const deptors = ref({})
const get_transfer = ref(false)
const get_income = ref(false)
const get_expense = ref(false)
const add_stock = ref(false)
const add_return = ref(false)
const accept_repay = ref(false)
const chartData = ref()

function hasPermission(per){
  return usePermissionStore().hasPermission(per)
}

const summary = ref({
  'income': 0,
  'sales': 0,
  'count': 0
})

function close(ev) {
  console.log(ev)
}

const reg_date = ref('')

function getStocks(result) {
  $api.get('/api/stocks/getSalesStock').then((res) => {

    const result = res.data
    stockStore.loadStocks(result.stocks, result.sales)
  })
    .catch((err) => {
      configStore.alert_msg = 'Error occured while loading stock'
    })

}

function getDashInfo() {
  $api.get('/api/charts/getDashInfo').then((res) => {
    console.log(res.data)
    const r = res.data
    summary.value.count = r.count
    summary.value.income = r.incomeSum
    summary.value.sales = r.salesSum
    chartData.value = r.revenue
    useNoticeStore().addTransferNotice(r.pendingTransfer)
    getRecentSales(r.recent)
    reg_date.value = r.reg_date
    loaded.value = true
  })
    .catch((err) => {
      
      configStore.alert_msg
    })
}


async function prepareData(item) {
  const items = []; let total = 0;
  await item.forEach(async element => {

    total = total + element.value
    element.value = total
    // element.label = new Date(element.label)
    items.push(element)

  });
  return items

}

function loadperMonth() {
  loaded.value = false;
  if (byMonth.value) {
    $api.defaults.headers.common.recordByMonth = true

  } else {
    $api.defaults.headers.common.recordByMonth = false
  }
  getDashInfo();
  
}

async function getRecentSales(result) {
  //await $api.post('/api/orders/getSalesByDate', { 'start': new Date() }).then((res) => {
  let headers = [
    {
      title: 'S/N',
      align: 'start',
      sortable: true,
      key: 'sn',
    },
    { title: 'Name', key: 'name' },
    { title: 'Phone', key: 'phone' },
    { title: 'Invoice/Order Id', key: 'order' },
    { title: 'Amount Paid', key: 'amount' }

  ];

  const content = []; let i = 0;

  const r = result
  r.forEach((et) => {
    let a = {
      'sn': ++i,
      'name': et.name,
      'phone': et.phone,
      'order': et.order_no,
      'amount': configStore.currencyFormatter().format(et.amount_paid)
    }
    content.push(a)
  })

  sales_record.value = {
    'headers': headers,
    'content': content
  }

  // })
  //   .catch((err) => {
  //     configStore.alert_msg = 'Error occurred while loading sales'
  //     console.log(err)
  //   })
}


function getDeptors() {
  const content = []; let i = 0;
  $api.post('/api/transactions/getDeptors').then((res) => {
    const r = res.data.result
    r.forEach((et) => {
      let a = {
        'sn': ++i,
        'name': et.name,
        'phone': et.phone,
        'order': et.order_no,
        'amount': configStore.currencyFormatter().format(et.remainder),
        'date': new Date(et.created_at).toLocaleDateString('en-gb'),
        'item': et
      }

      content.push(a)
    })

    let headers = [
      {
        title: 'S/N',
        align: 'start',
        sortable: true,
        key: 'sn',
      },

      { title: 'Name', key: 'name' },
      { title: 'Phone', key: 'phone' },
      { title: 'Invoice/Order Id', key: 'order' },
      { title: 'Amount', key: 'amount' },

      { title: 'Date', key: 'date' }

    ];

    deptors.value = {
      'headers': headers,
      'content': content
    }
  })
    .catch((err) => {
      console.log(err.response)
      configStore.alert_msg = 'Error occurred while loading deptors'
    })
}

onMounted(() => {
  getDashInfo();
  getStocks();
  getDeptors();
})



</script>


<style>
.v-card--variant-outlined {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.v-card--variant-outlined .v-card-subtitle {
  font-size: 1em;



}</style>