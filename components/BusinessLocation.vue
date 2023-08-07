<template>
<v-row>

            

                
</v-row>
</template>


<script setup lang=ts>
import { useNuxtApp } from 'nuxt/app';
import { Branch, useBranchStore } from '../store/branchStore';
import { useUsersStore } from '../store/users'
import { useConfigStore } from '../store/config'
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { usePermissionStore } from '~~/store/permissions';


const { $api } = useNuxtApp()
const branchStore = useBranchStore()
const usersStore = useUsersStore()
const configStore = useConfigStore()
const edit = ref(false)
const pageForm = ref()
const branches = ref([])

onMounted(()=>{

})
</script>