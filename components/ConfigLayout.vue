<template>
  <v-navigation-drawer permanent :rail="rail" color="secondary">
    <v-list-item prepend-icon="mdi-speedometer" title="Configuration Page" nav>
      <!-- prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" -->
      <template v-slot:append>
        <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-briefcase" v-if='hasPermission(["can_add_company_details","can_view_company_details","can_edit_company_details","can_delete_company_details"])' to="/company" value="home"></v-list-item>
      <v-list-item prepend-icon="mdi-sitemap" v-if='hasPermission(["can_add_branches","can_view_branches","can_edit_branches","can_delete_branches"])' to="/branch" value="Branch"></v-list-item>
      <v-list-item prepend-icon="mdi-account-multiple" v-if='hasPermission(["can_add_employees","can_view_employees","can_edit_employees","can_delete_employees"])' to="/employees" value="Employees"></v-list-item>
      <v-list-item prepend-icon="mdi-account-check" to="/roles" v-if='hasPermission(["can_add_user_roles","can_view_user_roles","can_edit_user_roles","can_delete_user_roles"])' title="User Roles" value="User Roles"></v-list-item>
      <v-list-item prepend-icon="mdi-palette" v-if='hasPermission(["can_add_company_details","can_view_company_details","can_edit_company_details","can_delete_company_details"])' to="/customization" value="System Theme"></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-container>
    <slot></slot>
  </v-container>
</template>

<script>
import { usePermissionStore } from '~~/store/permissions';

definePageMeta({
    layout: 'auth-layout'
});

export default {
  setup(){

    const rail = ref(true)
    const drawer = ref(true)
    function hasPermission(item){
      return usePermissionStore().hasPermission(item)
    }

    return {
      rail, drawer, hasPermission
    }
  }
  
}
</script>