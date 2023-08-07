<template>
  <v-row>
    <v-col cols="12" sm="4" md="3" lg="3" v-for="plan, i in plans" :key="i" >
      <v-card elevation="12" min-height="500px" class="plans pb-5" v-if="(i != 4)" @click="subscribe(plan)">
        <v-card-title class="v-btn title"> {{ plan.title }}</v-card-title>
        <ul class="items mt-n3">
          <li>
            <span> <v-icon icon="mdi-account"></v-icon> </span>
            <span>{{ plan.users }} Users</span>
          </li>
          <li>
            <span> <v-icon icon="mdi-sitemap"></v-icon> </span>
            <span>{{ plan.branches }} Branch Location</span>
          </li>
          <li>
            <span> <v-icon icon="mdi-cart"></v-icon> </span>
            <span>{{ plan.transactions }} Transactions per Month</span>
          </li>
          <li>
            <span> <v-icon icon="mdi-laptop"></v-icon> </span>
            <span> Mobile App & Website Access</span>
          </li>
          <li>
            <span> <v-icon icon="mdi-palette"></v-icon> </span>
            <span> Customizable Dashboard</span>
          </li>

          <li v-if="plan.exportable">
            <span> <v-icon icon="mdi-chart-bar"></v-icon> </span>
            <span> Exportable Report Sheets</span>
          </li>
          <li v-if="plan.auditor > 0">
            <span> <v-icon icon="mdi-book-open-page-variant"></v-icon> </span>
            <span> {{ plan.auditor }} Auditor Account</span>
          </li>

          <li>
            <v-btn variant="outlined" color="info" @click="subscribe(plan)">
              Subscribe
            </v-btn>
            
          </li>
        </ul>

        <div class="cost">
          <span>
            {{ plan.amount }} / Month
          </span>
        </div>

      </v-card>

    </v-col>
  </v-row>

  <SubscriptionSubPaymentModal @close="order = false" :plan="item" v-if="order" />
</template>

<script lang="ts" setup>
import { useConfigStore } from '~~/store/config';
import { useSubscriptionStore } from '~~/store/subscription'; 

const configStore = useConfigStore()
const subStore = useSubscriptionStore()
const emit = defineEmits(['selected'])
const { $api } = useNuxtApp()
const order = ref(false)
const item = ref({})
const plans = ref([])
const loading = ref(false)
const props = defineProps([
  'renew'
])

function loadSubscript() {
loading.value = true
  $api.defaults.headers.common.Authorization = `Bearer ${configStore.auth_token}`
  $api.get('/api/subscriptions/getPlans').then((res) => {
    console.log(res.data)
    plans.value = res.data.result
    subStore.loadPlans(res.data.result)
    loading.value = false
  })
    .catch((err) => {
      configStore.alert_msg = 'Error loading subscription plans'
    })
}

function subscribe(p) {
  item.value = p
  order.value = true
  emit('selected', p)
}

onMounted(()=>{
  loadSubscript()
})
</script>


<style>
.plans {

  display: flex;
  flex-flow: column nowrap;
  align-items: center;

}

.items {
  padding: 20px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  list-style-type: none;
}

.items li {
  margin: 10px;
  text-align: center;
  font-family: cursive;

}

.items li span {
  padding-right: 10px;
  font-size: 1.1rem;
}

.title {
  text-align: center;
  text-transform: uppercase;
  box-shadow: 0px 0px 10px 2px purple;
  margin: 15px auto;
  border-radius: 10px;
  height: 50px;
  width: auto;
  font-size: 1.6rem;
  font-weight: bold;

}

.cost {

  box-shadow: 0px 0px 10px 3px darkred;
  padding: 15px 20px;
  display: flex;
  border-radius: 20%;
  border: 2px double blue;
  background: linear-gradient(to right, darkviolet, darkred);
}

.cost span {
  font-size: 1.5em;
  color: blanchedalmond;
  font-weight: bolder;
  margin: 0 auto;

}

.btn {
  margin: 20px auto;

  text-align: center;
  display: block;

}

.main .title {
  color: goldenrod;
  text-align: left;
  box-shadow: 0 0 2px 0px white;
}

.plans {
  transition: all .4s ease-in-out;
}

.main h1 {
  font-size: 1.2em;
  font-style: italic;
}


.plans:hover {
  cursor: pointer;
  //transform: scale3d(-1.1, -1.1, 0.4);
  transform: scale(.9)
}
</style>