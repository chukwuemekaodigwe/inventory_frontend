<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col>
          <div p-5 mx-auto>
            <v-text-field @input="search" v-model="searchTerm"
              label="Search by name, sku, quantity, price"></v-text-field>
          </div>
        </v-col>
      </v-row>
      <v-row class="" v-if="toogle">
        <v-col v-for="card in products" :key="card.name" cols="6" md="3" sm="3" lg="2" style="cursor: pointer;">
          <v-card @click="showProduct(card)">

            <v-img :src="`${card.image}`" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px" cover>
              <p class="text-white text-center bg-blue-darken-4 text-subtitle-1">{{ card.name }}</p>
              <div class="m-0 d-flex flex-row"> <span class="d-none">{{ card.stock = stockStore.getStockQty(card.id) }}</span>
                <p class=" text-white px-2 text-left w-50"
                  :class="(card.stock > card.alert_level) ? 'bg-success' : 'bg-error'">
                  Qty: {{
                    formatNumber(card.stock)
                  }}</p>
                <p class="bg-blue-lighten-1 text-white px-2 text-right w-50"> {{ card.sku }}</p>
              </div>
            </v-img>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-navigation-drawer location="right" width="300" v-model="show" temporary>
          <productView @close="loadStock(); show=false;" :add="addProduct" :activeproduct="activeProduct" v-if="show" />
        </v-navigation-drawer>
      </v-row>

      <v-row>
        <v-col class="flex flex-row text-center" style="position: fixed; bottom: 15px" title="Add New Product">
          <v-btn icon="mdi-plus" color="success" elevation="20" @click="addProductShow">
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>


<script lang="ts">

import { storeToRefs } from 'pinia'
import { usePermissionStore } from '~~/store/permissions'
import { useConfigStore } from '~~/store/config'
import { Product, useProductStore } from '~~/store/productsStore'
import { useStockStore } from '~~/store/stocks'
import { formatNumber } from '../composables/getFilters';
definePageMeta({
  middleware: [
    function (to, from) {


      const permission = [
        "can_add_products", "can_view_products", "can_edit_products", "can_delete_products",
      ]

      if (!usePermissionStore().hasPermission(permission)) {
        useConfigStore().alert_msg = 'You dont have access to this page'
        return abortNavigation()
      }
    },

  ],
});


export default {
  name: 'Products',
  setup() {
    const { $api } = useNuxtApp()
    const store = useProductStore()
    const configStore = useConfigStore()
    const stockStore = useStockStore()
    const currency = configStore.getCurrency()


    const permission = [
      "can_add_products", "can_view_products", "can_edit_products", "can_delete_products",
    ]

    const activeProduct = ref({})
    const prod: Product[] = ref([])
    const products = computed(() => searchTerm.value ? prod.value : store.products)
    const toogle = ref(false)
    const addProduct = ref(false)
    const show = ref(false)

    const searchTerm = ref('')

    function getQuantity(product: number) {
      return stockStore.getStockQty
    }

    async function search() {
      const term = searchTerm.value
      const result = store.searchProduct(term)

      prod.value = result

      //return result
    }
function loadStock(){
  $api.get('/api/stocks/getSalesStock').then((res) => {
        const result = res.data
        stockStore.loadStocks(result.stocks, result.sales)
        toogle.value = true

      })
        .catch((err) => {
          configStore.alert_msg = 'error loading products'
          // console.log(err)

        })
}

    onMounted(() => {
      
loadStock()
    })


    function showProduct(ev) {
      show.value = true
      addProduct.value = false
      ev.product_type = (ev.type == 1) ? 'Countable' : "Measurable"
      ev.unit = ev.units
      activeProduct.value = ev

      // console.log(ev)
    }
    function addProductShow() {
      addProduct.value = true
      show.value = true
    }


    return {
      permission, loadStock,
      products, show, showProduct, activeProduct, addProduct, addProductShow, stockStore, configStore, getQuantity, currency,
      search, searchTerm, toogle

    }
  }
}
</script>

<style scoped>
.v-list-item-action {
  position: absolute;
  top: 0;
  left: 0;

}
</style>