<template>
    <v-menu transition="slide-x-transition" width="300px">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
                <v-badge :content="items.length" color="error">
                    <v-icon size="large">mdi-bell-outline</v-icon>
                </v-badge>
            </v-btn>
        </template>
        <v-list select-strategy="classic">
            
            <v-list-item v-for="(item, i) in items" :key="i" 
            :title="item.title" :subtitle="item.message" density="compact"
                @click="navigateTo(item.url)"></v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import { useNoticeStore } from '~~/store/notifications';
const {$api} = useNuxtApp();
const noticeStore = useNoticeStore();

const items = computed(() => noticeStore.notices);

</script>
    

