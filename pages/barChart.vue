<template>
  <div>
    <Bar v-if="loaded" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar, Line, Pie, Doughnut } from "vue-chartjs";
import {
  Chart as ChartJs, Title, Tooltip, Legend, BarElement, CategoryScale,
  LinearScale, LineElement, PointElement, ArcElement,
} from 'chart.js'

ChartJs.register(
  Title, 
  Tooltip, ArcElement,
  Legend, PointElement,
  BarElement, CategoryScale, LinearScale, LineElement,
)
const props = defineProps({
  items: {}
})
const loaded = ref(false)
const { $api } = useNuxtApp()
const data = ref([])

const chartData = ref({})
const loadedChart = () => {
  return chartData.value = {
    labels: data.value.map(el => el.name),
    datasets: [
      {
        barPercentage: 0.5,
        // barThickness: 6,
        maxBarThickness: 16,
        //barPercentage: 1.0,
        skipNull: true,
        //minBarLength: 2,
        label: 'Data One',
        //backgroundColor: '#f87979',
        data: data.value.map(el => el.stockQty - el.salesQty)

      },

    ],
  }
  console.log(chartData)
}



const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    colors: {
      forceOverride: true
    }
  },
  scales: {
    y: {
      beginAtZero: true
    },
    x: {
      grid: {
        offset: true
      }
    }
  },


});

onMounted(async () => {
  await $api.get('/api/charts/getStock').then((res) => {
    data.value = res.data.result
    loaded.value = true; loadedChart();
    console.log(res.data.result)
  })
    .catch((err) => {
      console.log(err)
    })
})

</script>