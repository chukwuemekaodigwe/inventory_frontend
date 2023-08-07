<template>
  <div>
    <v-app :theme="theme">

      <v-app-bar density="compact" :title="pageTitle" color="primary">
        <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>

        <v-spacer></v-spacer>
       
        <v-btn :prepend-icon="(theme === 'light') ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="changetheme">
        </v-btn>

      </v-app-bar>
      
      <v-navigation-drawer v-model="drawer" color="secondary" permanent>
        
      </v-navigation-drawer>

      <v-main>
        <v-container fluid>
          <div>
            <InfoAlert></InfoAlert>
          </div>
          <slot />
        </v-container>
        <Alert2 :show="showAlert" v-if="showAlert"></Alert2>
     

        <TFooter></TFooter>
      </v-main>
    </v-app>

  </div>
</template>

<script setup lang="ts">
import StockDialogs from '~~/components/stockDialogs.vue';
import { useConfigStore } from '~~/store/config';
import { useSalesStore } from '~~/store/sales';
import { useBranchStore } from '~~/store/branchStore';
const check_ledger = computed(()=> salesStore.ledger_alert ? true : false)
const config = useConfigStore()
const { $api } = useNuxtApp()
const salesStore = useSalesStore()
const open_registry = ref(false)
const isActive = ref(false)
const theme = computed(() => useBranchStore().thememode ? useBranchStore().thememode : 'light')
const drawer = ref(false)
const pageTitle = computed(() => useRoute().name?.toString().toLocaleUpperCase())

function changetheme() {
  useBranchStore().thememode = (useBranchStore().thememode === 'light') ? 'dark' : 'light'
}

const showAlert = computed(() => config.alert_msg ? true : false)
async function logout() {
  await $api.post('api/logout', {},
    { headers: { 'Authorization': `Bearer ${config.auth_token}` } }).then(async (res) => {
      await navigateTo('/login')
    })
    .catch((err) => {
      console.log(err)
    })

}

function show_registry() {
  open_registry.value = true
  salesStore.ledger_alert = false
  console.log(open_registry.value)
}


function checkRegistry(){
if (!salesStore.ledger_id){
  $api.get('/api/registry/checkActive').then((res) => {
    const d = res.data.result[0]
    
    if (d) {
      
      salesStore.ledger_id = d.id
    } else {
      return
    }
  })
    .catch((err) => {
      console.log(err.response.data)
      config.alert_msg = 'An error occurred '
    })
}
}
watch(check_ledger, (value)=>{
  checkRegistry()
})


</script>
