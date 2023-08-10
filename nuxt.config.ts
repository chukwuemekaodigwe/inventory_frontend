// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config"

export default ({
    
    ssr: false,
    target: 'static',

    css: [
        'vuetify/styles/main.sass',
        '@mdi/font/css/materialdesignicons.css',

    ],
    modules: [
        ['@pinia/nuxt', {
            autoImports: [
                // automatically imports `defineStore`
                'defineStore', // import { defineStore } from 'pinia'
                ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStor
            ],
        },

        ],
        '@pinia-plugin-persistedstate/nuxt',
        '@nuxtjs/cloudinary'



    ],
    build: {
        transpile: ['vuetify'],

    },

    // FOR THE .env use 

    runtimeConfig: {
        public: {
            MonnifyPaymentStatusUrl: process.env.MONNIFYBASEURL,
            MONNIFYAPIKEY: process.env.MONNIFYAPIKEY,
            MONNIFYCONTRACTCODE: process.env.MONNIFYCONTRACTCODE,
            IsTest: process.env.MONNIFYISTEST,
            MONNIFYBASEURL: process.env.MONNIFYBASEURL,
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            PRODUCT_PUBLIC_ID: process.env.PRODUCT_PUBLIC_ID,
            LOGO_PUBLIC_ID: process.env.LOGO_PUBLIC_ID,
            BACKEND_URL: process.env.BACKEND_URL
        }
    }

    // export default {
    //     publicRuntimeConfig: {
    //       myPublicVariable: process.env.PUBLIC_VARIABLE,
    //     },
    //     privateRuntimeConfig: {
    //       myPrivateToken: process.env.PRIVATE_TOKEN
    //     }
    //   }

})