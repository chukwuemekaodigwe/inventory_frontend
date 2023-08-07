<template>
    <div>
      <v-app :theme="theme">
  
        <v-app-bar density="compact" :title="pageTitle" color="primary">
  
          <template v-slot:prepend>

<img src="favicon.ico" alt="John" />

          </template>
          <v-toolbar-title> {{ pageTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn :prepend-icon="(theme === 'light') ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="changetheme">
          </v-btn>
  
         
        </v-app-bar>
        
  
        <v-main>
          <v-container>
            <slot />
            <!-- <v-progress-circular
      indeterminate
      color="amber"
    ></v-progress-circular>
     -->
          </v-container>
  
  
  
          <v-footer absolute>
            <v-spacer></v-spacer>
            <span>&copy; {{ new Date().getFullYear() }}</span>
            <v-spacer></v-spacer>
          </v-footer>
        </v-main>
      </v-app>
  
    </div>
  </template>
  
  <script setup lang="ts">
  const theme = ref('light')
  const drawer = ref(false)
  const pageTitle = ''
  function changetheme() {
    theme.value = (theme.value === 'light') ? 'dark' : 'light'
  }
  </script>