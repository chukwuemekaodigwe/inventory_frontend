<template>
    <!-- New Income dialog-->
    <v-row justify="center">
      <v-dialog v-model="incomeDialog" persistent width="400px">
        <v-card>
          <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">

          </v-card-title>
          <v-card-text style="display: flex; justify-content: center; align-items: center; flex-flow: column nowrap;">
            <v-icon color="success" icon="mdi-checkbox-marked-circle-outline" size="150px"></v-icon>
            <span class="text-center">Congratulations you've successfully joined the winning team! Go to your email to verify your account
              In the meantime continue with the setup!</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="close()">
              Close
            </v-btn>
  
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>
  
  <script lang="ts" setup>
  import { useConfigStore } from '~~/store/config'
  import { useSalesStore } from '~~/store/sales'
  import { useProductStore } from '~~/store/productsStore'
  import { useSubscriptionStore } from '../store/subscription'
  import { useUsersStore } from '~~/store/users'
  
  const emit = defineEmits(['close'])
  const { $api } = useNuxtApp()
  const configStore = useConfigStore()
  const productStore = useProductStore()
  const salesStore = useSalesStore()
  const content = ref([])
  const order = ref()
  const sales = ref([])
  const loaded = ref(false)
  const incomeDialog = ref(false)
  
  let item = reactive({
    customer_name: '',
    customer_phone: '',
    amount: 0,
    p_method: 1,
    duration: 0,
    selected: null,
  
  })
  const durations = ref([
    {
      'number': 3,
      'title': '3 Months'
    },
    {
      'number': 6,
      'title': '6 Months'
    },
    {
      'number': 12,
      'title': '12 Months'
    },
    {
      'number': 24,
      'title': '24 Months'
    },
  ])
  
  const subPlans = computed(() => useSubscriptionStore().plans.length ? useSubscriptionStore().plans : [])
  const amount = computed(() => getSum())
  
  function getSum() {
    const a = useSubscriptionStore().getPlanById(item.p_method)
    if (item.duration && a?.amount) {
      return a?.amount * item.duration
    } else {
      return 0
    }
  
  }
  
  
  function close() {
    incomeDialog.value = false
    emit('close', true)
  }
  
  const props = defineProps(['plan', 'renew'])
  
  function checkout() {
    const payload = item
  }
  
  function initialize(plan: number) {
    const a = useSubscriptionStore().getPlanById(plan)
    //item.amount = a?.amount
    item.p_method = plan
  
    if (props.renew) {
      const admin = configStore.company.admin
      const b = useUsersStore().getUserById(admin)
      item.customer_name = b?.name
      item.customer_phone = b?.phone
    } else {
      const b = configStore.user
      item.customer_name = b.name
      item.customer_phone = b.phone
  
    }
  }
  onMounted(() => {
  
    incomeDialog.value = true
  })
  
  </script>