<template>
    <v-card class="mx-auto pa-10 mt-10" width="400">
        <v-avatar style="display: flex; top: -30px; margin: 0 auto;" size="80">

            <img src="" alt="John">

        </v-avatar>
        <v-form v-model="formValidate">
            <v-text-field type="email" variant="outlined" autofocus v-model="form.email" label="E-mail" required
                autocomplete></v-text-field>

            <v-text-field active autocomplete variant="outlined" v-model="form.password"
                :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'" :type="showPwd ? 'text' : 'password'" name="input-10-1"
                label="Password" counter @click:append="showPwd = !showPwd" @keyPress:enter="login"></v-text-field>

<div class="d-flex" style="justify-content: space-between;">
            <v-btn :disabled="!formValidate" variant="outlined" rounded color="purple-accent-4" class="mr-4 d-block" @click="login">
                Submit
            </v-btn>

            <v-btn variant="plain" rounded color="secondary" class="mr-4 d-block" @click="navigateTo('/register')">
                Sign Up Instead
            </v-btn>
            <!-- 
            <v-btn color="error" class="mr-4" @click="reset">
                Reset Form
            </v-btn> -->

        </div>
        </v-form>
        <v-overlay :persistent="true" :model-value="overlay" class="align-center justify-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>

    </v-card>
</template>

<script lang="ts" setup>

import { useConfigStore } from '../store/config'
import { useBranchStore } from '../store/branchStore'
import { useProductStore } from '../store/productsStore'
import { useStockStore } from '../store/stocks'
import { useUsersStore } from '../store/users'
import { config } from 'process'
import { useSalesStore } from '~~/store/sales'
import { usePermissionStore } from '~~/store/permissions'
definePageMeta({
    layout: 'auth-layout'
});


//const { store } = usePinia()

const { $api } = useNuxtApp()

const userStore = useUsersStore()
const branchStore = useBranchStore()
const productsStore = useProductStore()
const stockStore = useStockStore()
//const userStore = useUsersStore()

const store = useConfigStore()

//const router = useStore();
const overlay = ref(false)
const form = reactive({
    email: '',
    password: ''
})

const showPwd = ref(false)
const formValidate = ref(true)

async function login() {
    
    await $api.postForm('/login', { 'email': form.email, 'password': form.password })
        .then(async res => {
            //console.log(res.data); //throw new Error('SSS')
            store.alert_msg = 'Login Successful'
            overlay.value = true
            await loadData(res).then(()=>{
                navigateTo('/')
            })
            overlay.value = false

        })
        .catch((err) => {
            console.log({ 'err': err })
            overlay.value = false
            store.alert_msg = err.response.data.message

        })
    }

   async function loadData(res){
    console.log(res.data.result)
        const user = res.data.result
            const token = res.data.token
            $api.defaults.headers.common.Authorization = `Bearer ${token}`
            $api.defaults.headers.common.Branch = user.branch.id
           // localStorage.setItem('active_branch', user.branch.id);
            //localStorage.setItem('token', token)
            
            store.branch = user.branch
            store.company = user.company
            store.auth_token = token
            store.user = res.data.user
            store.loggedIn_at = new Date()
            store.setupKeys(user)
           usePermissionStore().userpermissions = user.permission
           usePermissionStore().title = user.role_id

            productsStore.loadProducts(user.company.products)
            userStore.loadUsers(user.company.users)
            branchStore.loadBranches(user.company.branches)
            useBranchStore().colorScheme = JSON.parse(user.company.color)

    }
onMounted(() => {
    localStorage.clear()
})
function reset() {
    //$refs.form.reset()
}

</script>