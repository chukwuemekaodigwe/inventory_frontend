<template>
  <v-row>
    <v-col>
      <v-card class="pa-2" rounded="lg" min-height="300">
        <v-card-title class="">Today's Sales</v-card-title>
        
          <GChart type="BarChart" :data="sales.chartData" :options="sales.chartOptions" v-if="getSales" :key="1" />
        
        
      </v-card>
    </v-col>
    </v-row>
    <!-- <v-row>

    <v-col cols="12" sm="6"  md="6" lg="6">
      <v-card class="pa-2" rounded="lg" min-height="300">
        <v-card-title class="">Current Stock</v-card-title>
        <GChart type="PieChart" :data="stocks.chartData" :options="stocks.chartOptions" v-if="getSales" :key="3" />
      </v-card>
    </v-col>

  </v-row> -->

  <!--
  <v-row>
    <v-col cols="12" sm="6"  md="6" lg="6">
      <v-card class="pa-2" rounded="lg" min-height="300">
        <v-card-title>Today's Income </v-card-title>
        <GChart type="PieChart" :data="income.chartData" :options="income.chartOptions" v-if="getIncome" :key="2" />
      </v-card>
    </v-col>

    <v-col cols="12" sm="6"  md="6" lg="6">
      <v-card class="pa-2 py-0" rounded="lg" min-height="300">
        <v-card-title>Today's Expense </v-card-title>
        <GChart type="PieChart" :data="expense.chartData" :options="expense.chartOptions" v-if="getExpenses" :key="4" />
      </v-card>
    </v-col> -->

  
</template>
  
<script lang="ts" setup>
import { GChart } from 'vue-google-charts'
import { useProductStore } from '~~/store/productsStore'
import { useStockStore } from '~~/store/stocks'

const stocksStore = useStockStore()
const productsStore = useProductStore()

const sales = ref({})
const stocks = ref({})
const income = ref({})
const expense = ref({})
const getSales = ref(false)
const getStock = ref(false)
const getIncome = ref(false)
const getExpenses = ref(false)
const loaded = ref(false)

const props = defineProps({
  'data': {}
})


const opt = {
  chartArea: { width: '50%' },
  colors: ['#b0120a', '#ffab91'],
  hAxis: {
    title: 'Total Population',
    minValue: 0
  },
  vAxis: {
    title: 'City'
  }

}

function drawSalesGraph() {
  const data = productsStore.products.map((el) => {
    const qty = stocksStore.getSalesQty(el.id)

    return [
      el.name,
      qty
    ]

  })

  const chartData = [
    ['Products', 'Qty Sold'],

    ...data

  ]
  
  const chartOptions = {
    title: 'Quantity of Product Sold',
    height: 300,
    width: '100%',
    //hAxis: { title: '' },
    //vAxis: { title: 'Quantity of Product Sold' },
    legend: 'none',

  }

  sales.value = {
    'chartData': chartData,
    'chartOptions': chartOptions
  }
console.log(sales.value)
  getSales.value = true
  return true
}

function drawStockGraph() {
  const data = productsStore.products.map((el) => {
    return [
      el.name,
      stocksStore.getStockQty(el.id)
    ]
  })

  const chartData = [
    ['Product', 'Quantity'],
    ...data
  ]
  const chartOptions = {

    title: 'Quantity of Products in Stock',
    //subtitle: 'Sales, Expenses, and Profit: 2014-2017',
    height: 300,
    width: '100%',
   
     legend: 'none',

  }

  stocks.value = {
    'chartData': chartData,
    'chartOptions': chartOptions
  }

  getStock.value = true
}


function drawIncomeGraph() {

  const a = props.data.result.income
  const color = ['blue', 'orange', 'purple', 'indigo']
  const data = a.map((el, i) => {
    return [
      el.label,
      parseFloat(el.value),
      //color[i]
    ]
  })

  const chartData = [
    ['Type', 'Amount'],
    ...data
  ]
  const chartOptions = {
    
      title: 'Income/Debit Overview',
      height: '300',
      width: '100%',
      legend: 'none'
     
  }

  income.value = {
    'chartData': chartData,
    'chartOptions': chartOptions
  }

  getIncome.value = true
}


function drawExpenses() {
  const a = props.data.result.expenses
  const color = ['blue', 'orange', 'purple', 'indigo']
  const data = a.map((el, i) => {
    return [
      el.label,
      parseFloat(el.value),
      //color[i]
    ]
  })

  const chartData = [
    ['Type', 'Amount'],
    ...data
  ]
  const chartOptions = {

    title: 'Expenses/Credit Overview',
     height: 300,
     width: '100%',
    legend: 'none'
    //subtitle: 'Sales, Expenses, and Profit: 2014-2017',

  }

  expense.value = {
    'chartData': chartData,
    'chartOptions': chartOptions
  }

  getExpenses.value = true
}


onMounted(() => {
  drawExpenses(); drawIncomeGraph(); drawSalesGraph(); drawStockGraph()
})
</script>
  
  