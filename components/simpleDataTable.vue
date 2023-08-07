<template>
 <v-data-table
    :headers="props.headers"
    :items="props.content"
    class="elevation-1"
    item-key="name"
    items-per-page="6"
  >
  <template v-slot:item.returned="{ item }">
        <v-text-field density="compact" class="w-50 text-center" variant="underlined" v-model="item.returned" type="number" step="0.0000001"></v-text-field>
      </template>
  </v-data-table>
</template>

<script setup lang="ts">
const props = defineProps({
    'headers': {},
    'content': {}
})


</script>