<template>
  <client-only>
    <vue-monnify ref="vueMonnifyButton" :amount="amount" :api-key="monnifyAPIKey" :contract-code="monnifyContractCode"
      :customer-email="email" :is-test-mode="monnifyIsTest" :metadata="payMetadata" :on-close="monnifyClose"
      :on-complete="monnifyComplete" :reference="payRef" :payment-description="'Payment reference'">
      <!-- This could be an html template -->
      Make Payment
    </vue-monnify>
  </client-only>
</template>


<script type="text/javascript">

import VueMonnify from '../node_modules/vue-monnify'

export default {

  setup() {
    return {
      env: useRuntimeConfig()
    }
  },
  data() {
    return {

      monnifyAPIKey: this.env.MONNIFYAPIKEY, // This has both test and product values
      monnifyContractCode: this.env.MONNIFYCONTRACTCODE, // This has both test and product values
      monnifyIsTest: this.env.MONNIFYISTEST, // This should be true in test/dev environment and false in production
      payMetadata: {}, // This can be populated with key/values as you wish
      email: "calipsomelodies@gmail.com", // Customer email
      amount: 100 // of type:Number and in naira
    }
  },

  computed: {
    payRef() {
      let _ref = "";
      const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 10; i++)
        _ref += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));

      return _ref;
    }
  },

  methods: {
    monnifyComplete: function (response) {
      // Perform other operations upon complete
      console.log("Monnify Payment Complete", response)
    },
    monnifyClose: function (data) {
      // Perform other operations upon close
      console.log("Monnify Payment closed", data)
    }
  }
}
</script>