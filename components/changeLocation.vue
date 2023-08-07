<template>
  <div class="text-center">
    <v-menu>
      
      <template v-slot:activator="{ props: menu }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn size="large" prepend-icon="mdi-sitemap" variant="" v-bind="mergeProps(menu, tooltip)">
              
            </v-btn>
          </template>
          <span> Business Location: {{ configStore.branch.title }}</span>
        </v-tooltip>
      </template>
     
      <v-list select-strategy="classic">
        <v-list-item v-for="(item, index) in branchStore.getBranches" :key="index" @click="changeBranch(item)" class="bg-color-pink" :class="item.id == configStore.branch.id ? 'bg-color-gray' : ''"
          density="compact">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mergeProps } from 'vue'
import { useBranchStore } from '~~/store/branchStore';
import { useConfigStore } from '~~/store/config';


export default {
  data: () => ({
    branchStore: useBranchStore(),
    configStore: useConfigStore(),

  }),

  methods: {
    mergeProps,
   async changeBranch(a) {
      
    await  localStorage.setItem('active_branch', a.id);
      
      this.configStore.branch = a
      this.reloadWindow()

    },

 reloadWindow(){
  window.location.reload()
}

  },
}
</script>

