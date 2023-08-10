<template>
    <v-row>
        <v-col md="12">

            <v-card elevation="5" class="pa-5 mt-5 pb-10">
                <v-card-title class="ml-n5 mt-n1 text-tertiary-darken-1 text-uppercase">
                    Company Details
                </v-card-title>
                <v-form ref="pageForm" lazy-validation enctype="multipart/form-data">


                    <v-row justify="center">
                        <v-col cols="12" sm="6" md="8">
                            <v-text-field variant="outlined" v-model="form.name" :rules="rules" label="Company Name"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field variant="outlined" v-model="form.phone" :rules="rules" label="Company Phone"
                                required></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                            <v-text-field variant="outlined" v-model="form.email" :rules="rules" label="Company Email"
                                required></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="8">
                            <v-text-field variant="outlined" v-model="form.address" :rules="rules" label="Company Address"
                                required placeholder="1 ICT Way, Victoria Island"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field variant="outlined" v-model="form.city" :rules="rules" label="City"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-autocomplete variant="outlined" v-model="form.country" :items="countryList" label="Country"
                                required></v-autocomplete>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                            <v-autocomplete variant="outlined" v-model="form.timezone" :items="timezoneList"
                                label="Default Timezone" required></v-autocomplete>
                        </v-col>

                        <v-col cols="12" sm="6" md="4">
                            <CloudinaryUploadButton @error="useConfigStore().alert_msg = 'An error occurred, please retry'"
                                @success="processImage" :presetDefinintion="process.public.LOGO_PUBLIC_ID"
                                :label="'Upload Company Logo'" />
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-autocomplete variant="outlined" v-model="form.currency" :items="currencyList"
                                item-title="name" item-value="code" :rules="[v => !!v || 'Currency is required']"
                                label="Currency" required></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-autocomplete variant="outlined" hint="How do you wish the ledger to be used"
                                v-model="form.acct_type"
                                :items="[{ 'id': 0, 'name': 'Branch Based' }, { 'id': 1, 'name': 'Employee Based' }]"
                                item-value="id" item-title="name" label="Account Ledger Type" required></v-autocomplete>
                        </v-col>
                    </v-row>

                    <v-row justify="center" class="mt-10">
                        <v-btn color="tertiary" variant="outlined" class="mr-4" @click="submit">
                            Submit
                        </v-btn>

                        <v-btn color="error" variant="outlined" class="mr-4" @click="reset">
                            Reset
                        </v-btn>

                    </v-row>

                </v-form>
            </v-card>

        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { currencyList, timezoneList, countryList } from '../composables/currency'
import { timeZone } from '../composables/getFilters'

import { useConfigStore } from '~~/store/config'
import { usePermissionStore } from '~~/store/permissions'
import CloudinaryUploadButton from './Cloudinary/uploadButton'
const emit = defineEmits(['created'])
const props = defineProps(['company'])
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

const process = useRuntimeConfig()
const new_user = ref(false)
const { $api } = useNuxtApp()
const rules = ref([
    value => !!value || "This field is required",
])

const imageRules = ref([
    value => !!value || "Please upload a logo",
    value => !(value.size < 500000) || "Avatar size should be less than 0.5 MB!"
])

function submit() {
    const data = form.value
    if (data.name && data.address && data.currency) {


        let url = ''
        if (!useConfigStore().user.company_id) {
            url = '/api/companies/saveNew'

        } else {
            url = '/api/companies/updateCompany'
        }
        $api.post(url, { 'data': data }).then((res) => {
            const result = res.data.result
            useConfigStore().company = result
            emit('created', 'successful')
        })
            .catch((err) => {
                console.log(err)
                useConfigStore().alert_msg = 'An error occured'
            })
    } else {
        useConfigStore().alert_msg = 'Please fill up the form fields'
    }

}

function processImage(ev) {
    form.value.logo = ev
    useConfigStore().company.logo = ev
}

onMounted(()=>{
    if(props.company){
        form.value = props.company
    }
})
</script>