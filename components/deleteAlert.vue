<template>
    <v-dialog v-model="link" persistent width="300px">
        <v-card class="px-1 py-1">
            <v-card-text class="text-center">
                
                Do you really want to delete this Item
            </v-card-text>

            <v-card-actions class="d-flex row justify-around">
                <v-spacer></v-spacer>

                <v-btn color="info" @click="cancel">No</v-btn>
                <v-btn color="info" @click="Submit"> Yes</v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useConfigStore } from '../store/config'
const link = computed(() => useConfigStore().delete_alert ? true : false)
const { $api } = useNuxtApp()

const emit = defineEmits(['submitted'])
function Submit() {
    if (link) {
        const url = useConfigStore().delete_alert
        $api.delete(url).then((res) => {
            console.log(res.data.message)
            useConfigStore().alert_msg = `Successful : ${res.data.message}`
            emit('submitted')
            useConfigStore().delete_alert = false
        })
            .catch((err) => {
                console.log(err.response)
                useConfigStore().alert_msg = 'An error occurred'
            })
    }
}

function cancel() {
    useConfigStore().delete_alert = false
}
</script>