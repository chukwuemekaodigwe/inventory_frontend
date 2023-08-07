<template>
  <div class="text-center">

    <v-snackbar transition="true" v-model="snackbar" :timeout="timeout" color="black" elevation="24">
      <strong> {{ text }} </strong>

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="close">
          X
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script setup>
import { useConfigStore } from '../store/config'
const configStore = useConfigStore();


const props = defineProps({
  message: {
    default: 'My timeout is set to 2000.'
  },
  show: {
    default: false
  }

})

const snackbar = ref(false)
if (configStore.alert_msg) {
  snackbar.value = true

  setTimeout(() => {
    configStore.alert_msg = '';
    snackbar.value = false
  }, 5000)
}
const text = computed(() => configStore.alert_msg)
const timeout = 5000

function close() {
  configStore.alert_msg = ''
  snackbar.value = false
}


</script>