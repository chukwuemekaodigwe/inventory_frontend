<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="mt-5 ml-10">
        
      <span class="text-center">
        Welcome to VIP Inventory System, lets get started with these easy steps!
      </span>
      <v-slide-group v-model="tab2" class="d-flex justify-content-center ml-n2">
        <v-slide-group-item v-for="n, i in steps" :key="i" v-slot="{ isSelected, toggle }">
          <v-btn :prependIcon="n.icon" class="ma-2 font-weight-bold" variant="outlined" rounded
            :color="isSelected ? 'success' : undefined">
            {{ n.title }}
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>
      </v-col>
    </v-row>

    <v-window v-model="tab2">
      <v-window-item :value="0">
        <v-col cols="12" sm="8" md="5" lg="4" class="mx-auto">
        <signup @created=next(1)></signup>
      </v-col>
      </v-window-item>
      <v-window-item :value="1">
        <verify @close="next(2); "></verify>
      </v-window-item>
      <v-window-item :value="2">
        <v-container>
          <subscription @completed="next(3)"></subscription>
        </v-container>
      </v-window-item>
      <v-window-item :value="3">
        <v-col cols="10" class="mx-auto">
          <company-component @created="next(4)"></company-component>
        </v-col>

      </v-window-item>
      <v-window-item :value="4">
        <v-container>
          <final-msg></final-msg>
        </v-container>
        
      </v-window-item>
    </v-window>

  </v-container>
</template>

<script setup lang="ts">
import Customization from './customization.vue';
import Signup from './signup.vue';

definePageMeta({
  layout: false
});

const steps = ref([
  {
    'title': 'Sign up',
    'icon': 'mdi-account-plus'
  },

  {
    'title': 'Verification',
    'icon': 'mdi-account-check'
  },

  {
    'title': 'Subscription',
    'icon': 'mdi-alarm-multiple'
  },

  {
    'title': 'Customization',
    'icon': 'mdi-palette'
  },

])

const action = ref({})

const tab = ref(0)
const tab2 = ref(0)
function change(n) {
  tab2.value = n
}
function next(n) {
  
  tab2.value = n
}
</script>