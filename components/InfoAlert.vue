<template>
    <div style="position:fixed; top:20px;">

    </div>
    <v-slide-x-transition>
        <v-scroll-x-transition>
            <v-alert border="start" v-model="display" border-color="deep-purple pa-2 accent-4" elevation="2" closable
                close-label="Close Alert" :type="type" prominent>
                {{ message }}
            </v-alert>
        </v-scroll-x-transition>

    </v-slide-x-transition>
</template>

<script>
import { useConfigStore } from '~~/store/config';

export default {
    props: {
        type: {
            default: ''
        },
        msg: {
            default: 'Alert Mesage'
        },
        show: {
            default: false
        }
    },

    setup(props) {
        const store = useConfigStore()
        const display = ref(props.show)
        const message = ref('')
        watch((store.alert_msg), () => {
            display.value = true;
            message.value = store.alert_msg
        })
        return {
            display, message
        }
    }
}
</script>