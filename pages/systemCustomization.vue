<template>
<v-container>
    <CustomizationTheme @closed="navigateTo('/login')"/>
</v-container>


</template>
<script setup lang="ts">
import { useConfigStore } from '~~/store/config';

const {$api} = useNuxtApp()
definePageMeta({
    layout: 'auth-layout'
});


onMounted(()=>{
    $api.defaults.headers.common.Authorization = `Bearer ${useConfigStore().auth_token}`
    
})
</script>