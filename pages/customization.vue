<template>
    <ConfigLayout>
<CustomizationTheme />
        
    </ConfigLayout>
</template>

<script setup lang="ts">
    import { useNuxtApp } from 'nuxt/app';
    import { Branch, useBranchStore } from '../store/branchStore';
    import { User, useUsersStore } from '../store/users'
    import { useConfigStore } from '../store/config'
    import { usePermissionStore } from '~~/store/permissions';

    const { $api } = useNuxtApp()
    const branchStore = useBranchStore()
    const usersStore = useUsersStore()
    const configStore = useConfigStore()

definePageMeta({
        middleware: [
            function (to, from) {
                const permission = [
                    //  "can_add_branches","can_view_branches","can_edit_branches","can_delete_branches",
                    "can_add_company_details", "can_view_company_details", "can_edit_company_details", "can_delete_company_details",
                ]
                if (to.path === '/customization' && !usePermissionStore().hasPermission(permission)) {
                    useConfigStore().alert_msg = 'You dont have access to this page'
                    return abortNavigation()
                }
            },

        ],
    });


</script>