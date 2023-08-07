<template>
    <v-menu transition="slide-x-transition" width="300px">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
                <v-badge :content="salesStore.drafts.length" color="error">
                    <v-icon size="x-large">mdi-cloud-sync</v-icon>
                </v-badge>
            </v-btn>
        </template>
        <v-list select-strategy="classic">
            <v-list-subheader>Pending Sales Order</v-list-subheader>
            <v-list-item v-for="(item, i) in items" :key="i" :title="item.customer.name" :subtitle="item.customer.phone" density="compact"
                @click="show(item)"></v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import { Order, useSalesStore } from '~~/store/sales';

const salesStore = useSalesStore();

const items = computed(() => salesStore.getDrafts);
function show(ev:Order) {
    salesStore.showDraft(ev)
}

</script>
    

