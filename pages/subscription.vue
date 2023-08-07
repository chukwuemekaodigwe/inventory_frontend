<template>
  <subscription-sub-plans v-if="!next" @selected="getPlan"></subscription-sub-plans>

  <subscription-sub-payment-modal @completed="emit('completed')" :renew=true :plan="item" v-else></subscription-sub-payment-modal>
</template>

<script setup lang="ts">

const emit = defineEmits(['completed'])
const next = ref(false)
const item = ref()

function getPlan(a) {
  item.value = a
  next.value = true
}
</script>