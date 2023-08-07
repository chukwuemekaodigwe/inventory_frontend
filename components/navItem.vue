<template>
<v-list-item v-if="permission" :value="item" active-color="" :to="item.to" rounded="shaped" router
        exact>
        
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title v-text="item.title"></v-list-item-title>
        
      </v-list-item>


</template>

<script setup >
import { usePermissionStore } from '~~/store/permissions';
    const props = defineProps(['item'])

    const item = props.item

    const permission = computed(()=> usePermissionStore().hasPermission(item.permission))
</script>