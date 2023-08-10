<template>
    <div class="mx-auto">
        <v-card elevation="5" class="mx-auto pa-10 mt-2">
            <v-avatar style="display: flex; top: -30px; margin: 0 auto;" size="80">

                <v-icon icon="mdi-cart-outline" color="success" size="100px"></v-icon>
            </v-avatar>
            <v-form ref="form" v-model="valid" lazy-validation enctype="multipart/form-data">

                <v-text-field variant="outlined" v-model="form.name" :rules="rules" label="Firstname Lastname"
                    required></v-text-field>
                <v-text-field variant="outlined" v-model="form.phone" :rules="rules" label="Phone No"
                    required></v-text-field>
                <v-text-field variant="outlined" v-model="form.email" :rules="emailRules" label="E-mail" placeholder="Enter a valid enmail"
                    required></v-text-field>

                <v-text-field variant="outlined" v-model="form.password" :append-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
                    :rules="pwdRules" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" counter
                    @click:append="show1 = !show1"></v-text-field>

                <v-autocomplete variant="outlined" v-model="form.currency" :items="currencyList" item-title="name"
                    item-value="code" :rules="[v => !!v || 'Currency is required']" label="Default Currency"
                    required></v-autocomplete>

                <div class="d-flex" style="flex-flow: row nowrap; justify-content: center; align-items: center;">
                    <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
                        Submit
                    </v-btn>

                    <v-btn color="error" class="mr-4" @click="reset">
                        Reset
                    </v-btn>
                </div>
            </v-form>

        </v-card>
    </div>
</template>

<script>
import { useConfigStore } from "../store/config";
import { VueTelInputVuetify } from 'vue-tel-input-vuetify'
import { currencyList, timezoneList, countryList } from '../composables/currency'
export default {
    components: {
        VueTelInputVuetify,

    },
    auth: false,
    emits: ['created'],
    data() {
        return {
            show1: false,
            valid: false,
            configStore: useConfigStore(),
            form: {
                name: '',
                email: '',
                password: '',
                role: 1,
                phone: '',
                currency: ''
            },

            pwdRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 8) || 'At least 8 characters',
            ],

            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            select: null,
            items: [
                'NGN',
                '$',
                '#'

            ],
            rules: [
                value => !!value || 'This field is required',
            ],
            roles: [
                'admin',
                'cashier',
                'auditor'
            ],
            imageRules: [
                value => !!value || 'Please upload a logo',
                value => !(value.size < 500000) || 'Avatar size should be less than 0.5 MB!'
            ],
        }
    },
    methods: {
        async validate() {
            if (this.$refs.form.validate()) {

                await this.$api.postForm('/register', this.form, { headers: { 'Content-Type': 'multipart/form-data' } })
                    .then(async (res) => {
                        
                        this.configStore.user = res.data.user
                        this.configStore.auth_token = res.data.token
                        localStorage.setItem('token', res.data.token)
                        this.configStore.company.currency = this.form.currency
                        this.$emit('created', true)

                        this.$api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`
                        // this.configStore.alert_msg = 'Welcome on board, proceed to setup rest of the system'
                        //navigateTo('/company')
                    })
                    .catch((err) => {
                        console.log(err)
                        this.configStore.alert_msg = `Error: ${err.response.data.message}`
                    })
            }
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
    },

    setup() {

        async function formRequest(reqbody) {

            return await useAsyncData(() => this.$api(a, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: b,
                body: {
                    c
                },
                baseURL: 'http://127.0.0.1:8000/',

            }))
        }
        return {
            formRequest
        }
    }
}

</script>