<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="500px">

            <v-card>
                <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
            </v-card>

        </v-dialog>
    </v-row>
</template>

<script setup lang="ts">

import { StreamBarcodeReader } from "vue-barcode-reader";

const dialog = ref(true)
const emit = defineEmits(['close'])
function onDecode(text) {
    console.log(`Decode text from QR code is ${text}`)
}

function onLoaded() {
    console.log(`Ready to start scanning barcodes`)
}

</script>