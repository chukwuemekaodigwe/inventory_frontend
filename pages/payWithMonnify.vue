<template>
    <div>
        <v-btn color="indigo" style="box-shadow: inset 0px 0px 4px 2px violet, 1px 1px 3px 2px orangered;" size="large" @click="checkout"
            variant="outlined" class="text-center rounded-xl">Subscribe</v-btn>
    </div>
</template>

<script setup lang="ts">
const $api = useNuxtApp()

const props = defineProps([
    'item'
])


const item = {
    "amount": 60,
    "currency": "USD",
    "customerName": "EMEKA CHIDIEBERE",
    "customerEmail": "macd@gmail.com",
    "metaData": {
        "customer_email": "macd@gmail.com",
        "plan_id": 2,
        "type": "new"
    },
    "paymentDescription": "Payment for service of VIP SAAS Point of Sale"
}


const { amount, currency, customerName, customerEmail, metaData, paymentDescription } = item

const emits = defineEmits(['completed', 'closed', 'started']);

const envConfig = useRuntimeConfig()

function checkout() {
 //   console.log(props)
    MonnifySDK.initialize({
        amount: amount,
        currency: currency,
        reference: new String((new Date()).getTime()),
        customerFullName: customerName,
        customerEmail: customerEmail,
        apiKey: 'MK_TEST_MZZWH5ZF9N', // envConfig.public.MONNIFYAPIKEY,
        contractCode:  '9210510205', //envConfig.public.MONNIFYCONTRACTCODE,
        paymentDescription: paymentDescription,
        metadata: metaData,

        onLoadStart: () => {
            console.log("loading has started");
        },
        onLoadComplete: () => {
            console.log("SDK is UP");
            emits('started', metaData)
        },

        onComplete: function (response) {
            //Implement what happens when the transaction is completed.
            console.log(response);
            emits('completed', response)
        },
        onClose: function (data) {
            //Implement what should happen when the modal is closed here
            //      console.log(data);
        }
    })
}

function testTransaction(transRef: string) {
    const url = envConfig.public.MONNIFYBASEURL
    $api.get(`${url}/api/v2/transactions/${transRef}`).then((res) => {

    })
        emits('closed', data)
        .catch((err) => {

        })
}
onMounted(() => {

    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://sdk.monnify.com/plugin/monnify.js')
    document.head.appendChild(recaptchaScript)


    //checkout()
})
</script>