<template>
  <div>
    <v-list>
      <v-list-item :prepend-avatar="useConfigStore().company.logo" :title="useConfigStore().company.name"
        :subtitle="useConfigStore().company.name">
        <template v-slot:append>
          <v-btn icon="mdi-logout" @click="logout"></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list :lines="false" nav>
      <NavItem v-for="(item, i) in items" :key="i" :item="item" />
    </v-list>

    <div class="pa-2" slot="append">
      
        <div class="mb-3"
          v-if='hasPermission(["can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records"])'>
        <v-btn variant="outlined" color="primary">
          <ChangeLocation />
          {{ useConfigStore().branch.title }}
        </v-btn>
        </div>

      <v-btn block @click="">
        Send Feedback
      </v-btn>
    </div>

  </div>
</template>


<script setup lang="ts">
import { usePermissionStore } from '~~/store/permissions';
import { useConfigStore } from '~~/store/config';
import NavItem from './navItem.vue';

const { $api } = useNuxtApp()

// definePageMeta({
//   middleware: [
//     function (to, from) {
//       const a = items.find((el)=>el.to == to.path)
//       if(!usePermissionStore().hasPermission(a.permission)){
//         useConfigStore().alert_msg = 'You dont have access to this page'
//         return abortNavigation()
//       }
//     },
    
//   ],
// });


let i = ref(0)

const items = [
  {
    icon: 'mdi-home',
    title: 'Welcome',
    to: '/',
    permission: []
  },
  {
    icon: 'mdi-cart',
    title: 'Point of Sale',
    to: '/store',
    permission: ['can_add_sales']
  },
  {
    icon: 'mdi-tag-multiple',
    title: 'Products',
    to: '/product',
    permission: ['can_add_products', 'can_view_products', 'can_edit_products', 'can_delete_products']
  },

  {
    icon: 'mdi-database',
    title: 'Stocks',
    to: '/stockReport',
    permission: ['can_add_stock', 'can_view_stock', 'can_edit_stock', 'can_delete_stock', "can_add_branch_records", "can_view_branch_records", "can_edit_branch_records", "can_delete_branch_records", "can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records"]
  },

  // {
  //   icon: 'mdi-bank',
  //   title: 'Sales',
  //   to: '/salesReport',
  // },
  {
    icon: 'mdi-chart-bar',
    title: 'Transactions',
    to: '/transactions',
    permission: ['can_add_income', 'can_view_income', 'can_add_expenses', "can_edit_income", "can_delete_income", "can_view_expenses", "can_edit_expenses", "can_delete_expenses", "can_add_fund_transfer", "can_view_fund_transfer", "can_edit_fund_transfer", "can_delete_fund_transfer", "can_add_payments", "can_view_payments", "can_edit_payments", "can_delete_payments", "can_view_sales", "can_edit_sales", "can_delete_sales", "can_add_product_returns", "can_view_product_returns", "can_edit_product_returns", "can_delete_product_returns", "can_add_others_records", "can_view_others_records", "can_edit_others_records", "can_delete_others_records", "can_add_own_records", "can_view_own_records", "can_edit_own_records", "can_delete_own_records", "can_add_branch_records", "can_view_branch_records", "can_edit_branch_records", "can_delete_branch_records", "can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records"]
  },
  {
    icon: 'mdi-book-multiple',
    title: 'Daily Summary',
    to: '/ledger',
    
    permission: [
      "can_view_ledger", "can_edit_ledger", "can_delete_ledger",
      "can_add_branch_records", "can_view_branch_records", "can_edit_branch_records", "can_delete_branch_records", "can_add_other_branch_records", "can_view_other_branch_records", "can_edit_other_branch_records", "can_delete_other_branch_records",
    ]
  },
  {
    icon: 'mdi-autorenew',
    title: 'Subscription',
    to: '/subscription',
    permission: [
      "can_add_subscription", "can_view_subscription",
      "can_edit_subscription", "can_delete_subscription",
    ]
  },
  {
    icon: 'mdi-wrench',
    title: 'Configurations',
    to: '/company',
    permission: [
      "can_add_company_details", "can_view_company_details", "can_edit_company_details", "can_delete_company_details",
      "can_add_employees", "can_view_employees", "can_edit_employees", "can_delete_employees", "can_add_user_roles", "can_view_user_roles", "can_edit_user_roles", "can_delete_user_roles", "can_add_branches", "can_view_branches", "can_edit_branches", "can_delete_branches",
    ]
  },

];

function hasPermission(abil) {
  
  //return true
  return usePermissionStore().hasPermission(abil)
}

async function logout() {
  await $api.post('api/logout', {},
    { headers: { 'Authorization': `Bearer ${useConfigStore().auth_token}` } }).then(async (res) => {
      localStorage.clear()
      await navigateTo('/login')
    })
    .catch((err) => {
      
      useConfigStore().alert_msg = 'Error logging out'
    })

}

</script>