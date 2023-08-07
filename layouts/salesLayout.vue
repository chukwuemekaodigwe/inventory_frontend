<template>
    <div>
        <v-app :theme="theme">

            <v-app-bar density="compact" class="text-uppercase" :title="pageTitle" color="primary">

                <template v-slot:prepend>
                    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                </template>
                <v-toolbar-title style="font-size: 1em; font-weight:bold;">
                    
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn :prepend-icon="(theme === 'light') ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="changetheme">
                </v-btn>

                <template v-slot:append>
                    <v-btn icon="mdi-logout" @click="logout"></v-btn>
                </template>

                <v-btn icon v-if="salesStore.cart.length != 0" @click="salesStore.checkOut">
                    <v-badge :content="salesStore.cart.length" color="error">
                        <v-icon size="x-large">mdi-cart</v-icon>
                    </v-badge>
                </v-btn>
                <v-btn icon v-if="salesStore.drafts.length != 0">
                    <ShowDrafts />
                </v-btn>

            </v-app-bar>
            <v-navigation-drawer v-model="drawer" temporary>
                <NavBar />
            </v-navigation-drawer>


            <v-main>
                <v-container fluid>
                    <div>
                        <InfoAlert></InfoAlert>
                    </div>
                    <slot />
                </v-container>
                <Alert2 :show="showAlert" v-if="showAlert"></Alert2>
                <TFooter></TFooter>
            </v-main>
        </v-app>

    </div>
</template>
  
<script setup lang="ts">
import { useConfigStore } from '~~/store/config';
import { useSalesStore } from '~~/store/sales';


const config = useConfigStore()
const { $api } = useNuxtApp()
const salesStore = useSalesStore()


const theme = ref('light')
const drawer = ref(false)
const pageTitle = computed(() => 'Sales Store')
function changetheme() {
    theme.value = (theme.value === 'light') ? 'dark' : 'light'
}

const showAlert = computed(() => config.alert_msg ? true : false)
async function logout() {
    await $api.post('api/logout', {}).then(async (res) => {
        console.log(res.data)
        localStorage.removeItem('token')
        //setTimeout((), 50000)
        await navigateTo('/login')
    })
        .catch((err) => {
            console.log(err)
        })

}

</script>
  
<style>
.v-list-item-action {
    position: absolute;
    top: 0;
    left: 0;

}

.v-text-field {
    margin-bottom: 0;
}

.v-input__details {
    display: none;

}

.v-label {
    font-size: .8rem;
}
</style>