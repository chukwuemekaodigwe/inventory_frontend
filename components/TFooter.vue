<template>
  <v-footer class=" px-4 py-1 bg-gray text-center" style="position:absolute; bottom: 0">

      {{ new Date().getFullYear() }} — <strong>Vuetify</strong>

  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ],
    }),
  }
</script>