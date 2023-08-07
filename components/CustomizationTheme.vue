<template>

    <v-row>
        <v-col cols="12" sm="6">
            <v-card elevation="4" class="pa-5 pb-10">
                <div class="font-weight-medium text-tertiary"> System
                    Customization</div><v-divider></v-divider>
                <span class="mb-5 py-2 d-block text-caption">Please be sure to select the appropriate colors that fits
                    the various system modes: light / dark mode. Use the invoice receipts as a preview page of the
                    effects of various selections <b>Remember to save after customization</b> </span>
                <v-form ref="pageForm">

                    <v-row>
                        <v-col cols="6">
                            <v-text-field variant="outlined" @input="changePri" density="compact" v-model="form.pri"
                                type="color" label="Main color (Light mode)"></v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <v-text-field variant="outlined" @input="changePri2" density="compact" v-model="form.pri2"
                                type="color" label="Main color (Dark mode)"></v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <v-text-field variant="outlined" @input="changeSec" density="compact" v-model="form.sec"
                                type="color" label="Secondary (Light mode)" required></v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <v-text-field variant="outlined" @input="changeSec2" density="compact" v-model="form.sec2"
                                type="color" label="Secondary (Dark mode)" required></v-text-field>
                        </v-col>

                        <span class="text-caption">For Headings & Buttons</span> <v-divider></v-divider>


                        <v-col cols="6">
                            <v-text-field @input="changeText1" variant="outlined" density="compact" v-model="form.text1"
                                type="color" label="Text Color {light mode}" required></v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <v-text-field @input="changeText2" variant="outlined" density="compact" v-model="form.text2"
                                type="color" label="Text Color(Dark mode)" required></v-text-field>
                        </v-col>

                        <v-col style="display: flex; justify-content: space-between;">
                            <v-btn rounded @click="(edit) ? saveEdit() : saveNew()" color="tertiary">Save</v-btn>
                            <!-- <v-btn variant="outlined" rounded color="primary" @click="navigateTo('/login')">Proceed to Login >></v-btn> -->
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>
        </v-col> 
        <v-col cols="12" sm="5">
            <InvoiceBigInvoice />
        </v-col>


       
    </v-row>
</template>

<script setup lang="ts">

import Color from 'color'

import { useNuxtApp } from 'nuxt/app';
import { Branch, useBranchStore } from '../store/branchStore';
import { User, useUsersStore } from '../store/users'
import { useConfigStore } from '../store/config'
import { usePermissionStore } from '~~/store/permissions';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useTheme } from 'vuetify'

import smallInvoice from '../components/invoice/smallInvoice.vue'
import bigInvoice from '../components/invoice/bigInvoice.vue'

const { $api } = useNuxtApp()
const branchStore = useBranchStore()
const usersStore = useUsersStore()
const configStore = useConfigStore()
const edit = ref(false)
const pageForm = ref()
const users = ref([])

const { mobile } = useDisplay()
const theme = useTheme()
const status = ref(['unpaid', 'delivered'])
const roles = ref([])

const form = ref({
    'pri': '',
    'pri2': '',
    'sec': '',
    'sec2': '',
    'text1': '',
    'text2': ''
})

function changePri() {
    let a = form.value.pri
    branchStore.thememode = 'light'
    theme.themes.value.light.colors.primary = a
    const color = Color(a);

    theme.themes.value.light.colors.secondary = color.darken(0.5).hex()
    theme.themes.value.light.colors.tertiary = color.lighten(0.1).hex()
    theme.themes.value.dark.colors.primary = color.darken(0.2).hex()
    theme.themes.value.dark.colors.secondary = color.darken(0.6).hex()

    theme.themes.value.dark.colors.tertiary = color.lighten(0.5).hex()

    //theme.themes.value.light.colors.forecolor = color.grayscale().hex()

    const b = form.value
    b.pri2 = color.whiten(0.5).hex()
    b.sec = color.darken(0.5).hex()
    b.sec2 = color.darken(0.6).hex()
    b.text1 = color.lighten(0.1).hex()
    b.text2 = color.lighten(0.5).hex()

}


function changePri2() {
    branchStore.thememode = 'dark'
    const a = form.value.pri2
    //theme.themes.value.dark.dark 
    theme.themes.value.dark.colors.primary = a
}


function changeSec() {
    const a = form.value.sec
    branchStore.thememode = 'light'

    theme.themes.value.light.colors.secondary = a
}


function changeSec2() {
    const a = form.value.sec2
    branchStore.thememode = 'dark'
    theme.themes.value.dark.colors.secondary = a
}


function changeText1() {
    const a = form.value.text1
    branchStore.thememode = 'light'
    theme.themes.value.light.colors.tertiary = a
}


function changeText2() {
    const a = form.value.text2
    branchStore.thememode = 'dark'
    theme.themes.value.dark.colors.tertiary = a
    
}

const branches = computed(() => branchStore.branches)
const emits = defineEmits(['closed'])

function saveNew() {
    const user = form.value

    if (user.pri && user.pri2 && user.sec2 && user.text2 && user.sec && user.text1) {

        $api.post('/api/companies/saveTheme', { 'data': user }).then((res) => {

            branchStore.colorScheme = user
            configStore.alert_msg = 'Successfully saved'

            emits('closed', true)
        })
            .catch((err) => {
                console.log(err)
                configStore.alert_msg = `An error occurred: ${err.response.data.message}`
            })
    } else {
        configStore.alert_msg = "Error: Please ensure you've selected all the color themes and have tested them out"
    }

}


onMounted(() => {
    
})


</script>

<style>
td {
    text-align: center;
}

.font-weight-medium {
    font-weight: bold;
    text-transform: uppercase;

}

.subsection * {
    margin-top: -10px;


}

.small-invoice p,
.small-invoice th,
.small-invoice td {
    font-size: .7em
}

.small-invoice img {
    width: 50px !important;
}

p,
th,
td {
    font-size: .9em;
}
</style>