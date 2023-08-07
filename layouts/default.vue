<template>
  <div>
    <v-app :theme="theme">

      <v-app-bar density="compact" class="text-uppercase font-weight-bold" color="primary">

        <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <div
            v-if='hasPermission(["can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records"])'>
            <ChangeLocation />
          </div>
        </template>
        
        <v-app-bar-title style="font-family: 'Nunito Sans'; font-weight: 600" class="text-uppercase d-none d-sm-flex">
          {{ useRoute().name == 'index' ? '' : useRoute().name }}
        </v-app-bar-title>
        <v-spacer></v-spacer>
        
        <v-tooltip open-on-hover location="top" v-if="hasPermission(['can_add_ledger'])">
          
          <template v-slot:activator="{ props: tooltip }">
            <span class="d-none d-sm-flex" title="Active Account Ledger Date">
            DT: {{ useSalesStore().date ? new Date(useSalesStore().date).toLocaleDateString('en-gb') : 'Closed'}}
            </span>
            <v-btn icon @click="show_registry()" v-bind="tooltip">
              <v-badge :color="salesStore.ledger_id ? 'success' : 'error'">
                <v-icon>mdi-book-open-page-variant</v-icon>
              </v-badge>
              
            </v-btn>
          </template>

          <span> Account Legder Date</span>
        </v-tooltip>

      
        <NoticeIcon v-if="useNoticeStore().notices.length" />

        <template v-slot:append>
          <v-btn icon @click="changetheme">
          <v-icon>
            {{  (theme === 'light') ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
          </v-icon>
        </v-btn>

          <v-btn class="d-none d-sm-flex" icon="mdi-logout" @click="logout"></v-btn>
        </template>

        <v-btn icon v-if="salesStore.cart.length != 0 && hasPermission(['can_add_sales'])"
          @click="salesStore.cart_out = true">
          <v-badge :content="salesStore.cart.length" color="success">
            <v-icon>mdi-cart</v-icon>
          </v-badge>
        </v-btn>

        <v-btn icon v-if="salesStore.drafts.length != 0 && hasPermission(['can_add_sales'])">
          <ShowDrafts />
        </v-btn>

      </v-app-bar>
      <v-navigation-drawer v-model="drawer" color="secondary" temporary>
        <NavBar />
      </v-navigation-drawer>


      <v-main>

        <slot />

        <Alert2 :show="showAlert" v-if="showAlert"></Alert2>

        <RegistryViews @close="open_registry = false" :show-page="open_registry" v-if="open_registry" />

        <v-dialog v-model="check_ledger" persistent width="300px">
          <v-card aria-multiline="true" class="px-1 py-1">
            <v-card-text multiline class="text-center">

              You need to open an account ledger to continue!
              <span v-if="salesStore.ledger_id" color="red"><i>
                  <v-divider class="my-2"></v-divider>
                  You have an open ledger, do you wish to continue with it ? </i>
              </span>
            </v-card-text>

            <v-card-actions class="d-flex row justify-around">
              <v-spacer></v-spacer>
              <span v-if="!salesStore.ledger_id">
                <v-btn color="info" @click="salesStore.ledger_alert = false">Cancel</v-btn>
                <v-btn color="info" @click="show_registry">Open Ledger</v-btn>
              </span>
              <span v-else>
                <v-btn color="info" @click="show_registry"> View</v-btn>
                <v-btn color="info" @click="show_registry">No</v-btn>
                <v-btn color="info" @click="salesStore.ledger_alert = false">Yes</v-btn>

              </span>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <TFooter></TFooter>
      </v-main>
    </v-app>

  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useRoute } from 'nuxt/app';

import StockDialogs from '~~/components/stockDialogs.vue';
import { useBranchStore } from '~~/store/branchStore';
import { useConfigStore } from '~~/store/config';
import { useSalesStore } from '~~/store/sales';
import { useNoticeStore } from '~~/store/notifications';
import { usePermissionStore } from '../store/permissions'
import checkReg from '~~/composables/registryChecker';

const check_ledger = computed(() => salesStore.ledger_alert ? true : false)
const config = useConfigStore()
const { $api } = useNuxtApp()
const salesStore = useSalesStore()
const open_registry = ref(false)
const isActive = ref(false)
const theme = computed(() => useBranchStore().thememode ? useBranchStore().thememode : 'light')
const drawer = ref(false)
const pageTitle = computed(() => useRoute().name)
const themeApp = useTheme()


function changetheme() {

  useBranchStore().thememode = (useBranchStore().thememode === 'light') ? 'dark' : 'light'
}


const showAlert = computed(() => config.alert_msg ? true : false)
async function logout() {

  await $api.post('api/logout', {},
    { headers: { 'Authorization': `Bearer ${config.auth_token}` } }).then(async (res) => {
      localStorage.clear()
      await navigateTo('/login')
    })
    .catch((err) => {
      
      config.alert_msg = 'Error logging out'
    })

}

function hasPermission(p) {
  return usePermissionStore().hasPermission(p)
}

function show_registry() {
  open_registry.value = true
  //salesStore.ledger_alert = false
  //  console.log(open_registry.value)
}


onBeforeMount(async () => {

  $api.defaults.headers.common.Authorization = `Bearer ${config.auth_token}`
  $api.defaults.headers.common.Branch = config.branch.id

  if (!useBranchStore().colorScheme) {
    await $api.get('/api/companies/getTheme').then((res) => {
      useBranchStore().colorScheme = JSON.parse(res.data.result)

    })
      .catch((err) => {
        useConfigStore().alert_msg = 'An error occured loading theme'
        console.log(err.response.message)
      })
  }

  const { pri, pri2, sec, sec2, text1, text2 } = useBranchStore().colorScheme
  useTheme().themes.value.light.colors.primary = pri
  useTheme().themes.value.dark.colors.primary = pri2
  useTheme().themes.value.light.colors.secondary = sec
  useTheme().themes.value.dark.colors.secondary = sec2
  useTheme().themes.value.light.colors.tertiary = text1
  useTheme().themes.value.dark.colors.tertiary = text2


})

onMounted(()=>{
  checkReg()
})

</script>

<style>
.v-data-table-header__content {
  font-size: small;
  text-transform: uppercase;
}

.v-data-table__td {
  font-size: .9rem !important;
  ;
  text-overflow: ellipsis !important;
  ;
  text-transform: uppercase;
  text-align: left;
}

/*

.v-list-item-action {
  position: absolute;
  top: 0;
  left: 0;

}

.v-text-field {
  margin-bottom: 0;
}

.v-input__details {
  display: none;

}

.v-label {
  font-size: .8rem;
}*/</style> 