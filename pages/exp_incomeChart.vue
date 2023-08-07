<template>
  <div>
    <Bar v-if="props.type == 'barchart'" :data="data" :options="chartOptions" />
    <PolarArea v-if="props.type == 'pie'" :data="data" :options="chartOptions" />
    <Line v-if="props.type == 'line'" :data="data" :options="chartOptions" />
    <Doughnut v-if="props.type == 'doughnut'" :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Bar, Line, Pie, PolarArea, Doughnut } from "vue-chartjs";
import {
  Chart as ChartJs, Title, Tooltip, Legend, BarElement, CategoryScale,
  LinearScale, LineElement, PointElement, ArcElement,
  Colors
} from 'chart.js'

ChartJs.register(
  Title, Colors,
  Tooltip, ArcElement,
  Legend, PointElement,
  BarElement, CategoryScale, LinearScale, LineElement,
)
const props = defineProps({
  'type': null,
  'data': [],
  'data2': [],
  'chartTitle': null
})

var data = {
    labels: props.data.map((el) => el.label),
    datasets: [{
    		label:  'Income Revenue',
        data: props.data.map((el) => el.value),
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(200,10,10,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
    },
   

    ]
};



var options = {
    fill:true
}


console.log({'income': props.data})
const data2 = {
  labels: props.data2.map(el=>el.label),
  datasets: [
    {
    label: 'expenses',
    data: props.data2.map(el=>el.value),
    fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(200,10,10,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        hoverBackgroundColor: 'rgba(100, 0, 0, 0.5)',
    hoverOffset: 35,
  },
  {
    label: 'income',
    data: props.data.map(el=>el.value),
    backgroundColor: [

      '#aabbee',
      '#990000',
      '#99ff00',
      '#994400',
      '#9900ff',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)',
      '#99aa00',
      '#aabbee',
      '#990000',
      '#99ff00',
      '#994400',
      '#9900ff',
    ],

    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 2,
    //borderColor: 'rgba(255, 255, 255, 1)',
    //radius: 100,
    hoverBackgroundColor: 'rgba(100, 0, 0, 0.5)',
    hoverOffset: 35,
  },

]
};

const chartData = ref({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [40, 20, 12, 50, 10],
    },
  ],

});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: (props.type != 'doughnut' ? true : false),
  scales: {
    y: {
      ticks: {
        beginAtZero: true
      },
      gridLines: {
        display: true
      }
    },
    x: {
      //ticks: true, // (props.type !== 'line' ? true : false),
    }
  },
});


</script>