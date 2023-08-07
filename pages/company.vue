<template>
    <ConfigLayout>
        <CompanyComponent @created="useConfigStore().alert_msg = 'successfully saved'" :company="form" v-if="loaded"/>
    </ConfigLayout>
</template>

<script setup>
import { useConfigStore } from '../store/config'

const pageForm = ref()
let form = ref({
    name: "",
    email: '',
    timezone: '',
    acct_type: '',
    phone: "",
    city: "",
    company_address: "",
    country: "",
    currency: "",
    logo: ""
})
const loaded = ref(false)
const process = useRuntimeConfig()
const new_user = ref(false)
const { $api } = useNuxtApp()

function getCompany() {
    $api.get('/api/companies/getCompany').then((res) => {
        const c = res.data.result
        form.value = c
        
        form.value.acct_type = c.registry_by_user ? 1 : 0

        //     form.value.name = c.name
        // form.value.email = c.email
        // form.value.address = c.address
        // form.value.currency = c.currency
        // form.value.phone = c.phone
        // form.value.city = c.city
        // form.value.country = c.country
        // form.value.timezone = c.timezone
loaded.value = true
    })
        .catch((err) => {

            useConfigStore().alert_msg = 'An error occured'
        })


}

definePageMeta({
    // middleware: [
    //     function (to, from) {
    //         const permission = [
    //             "can_add_company_details", "can_view_company_details", "can_edit_company_details", "can_delete_company_details",
    //         ]
    //         if (to.path === '/company' && !usePermissionStore().hasPermission(permission)) {
    //             useConfigStore().alert_msg = 'You dont have access to this page'
    //             return abortNavigation()
    //         }
    //     },

    // ],
});

onMounted(() => {
    if (useConfigStore().user.company_id) {
        getCompany()
    } else {
        new_user.value = true;
    }
})

</script>