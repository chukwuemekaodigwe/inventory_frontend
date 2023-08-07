<template>
    <v-sheet class="m-0 m-n2" elevation="6">
        <v-tabs v-model="tab" color="purple-accent-4" align-tabs="center">
            <v-tab @click="showTable('current')">Current Stock</v-tab>
            <v-tab @click="showTable('timeline')">Stocks Timeline</v-tab>
            <v-tab @click="showTable('transfer')">Transfered Stock</v-tab>
            <v-tab @click="showTable('removed')">Removed Stock</v-tab>
            <v-tab @click="showTable('deleted')">Current Stock</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item :value="0">
                <v-card height="200px" class="d-flex justify-center align-center">
                    <span class="text-h2">Card {{ n }}</span>
                </v-card>
            </v-window-item>

            <v-window-item :value="1">
                <v-card height="200px" class="d-flex justify-center align-center">
                    <span class="text-h2">Card {{ n }}</span>
                </v-card>
            </v-window-item>

            <v-window-item :value="2">
                <v-card height="200px" class="d-flex justify-center align-center">
                    <span class="text-h2">Card {{ n }}</span>
                </v-card>
            </v-window-item>

            <v-window-item :value="3">
                <v-card height="200px" class="d-flex justify-center align-center">
                    <span class="text-h2">Card {{ n }}</span>
                </v-card>
            </v-window-item>

            <v-window-item :value="4">
                <v-card height="200px" class="d-flex justify-center align-center">
                    <span class="text-h2">Card {{ n }}</span>
                </v-card>
            </v-window-item>


        </v-window>
    </v-sheet>
</template>

<script setup lang="ts">

const tab = ref(0)
const n = ref('Hie')
function showTable(page: string) {
n.value = page
}
</script>