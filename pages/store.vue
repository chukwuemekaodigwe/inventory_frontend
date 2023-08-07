<template>
  <div>
    <v-row>
      <v-col>
        <div p-5 mx-auto>
          <v-text-field @input="search" v-model="searchTerm" label="Search by name, sku, quantity, price"></v-text-field>
          <!-- <v-btn>Scan BarCode</v-btn> -->
        </div>

        <v-container fluid>
          <v-row dense>
            <v-col  v-if="loaded" v-for="(card, index) in products" :key="index" cols="4" sm="3" md="2" style="cursor: pointer;">
              <v-card @click="showProduct(card)">

                <v-img :src="``" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px"
                  cover>

                  <v-row>
                    <v-col cols="12" class="bg-primary-darken-1 vcol">
                      <p class="text-center text-subtitle-1">{{ card.name }}</p>
<span class="d-none">{{ card.stock = getQuantity(card.id) }}</span>
                    </v-col>
                    <v-col cols="12" sm="6" class="vcol"  
                      :class="(getQuantity(card.id) > card?.alert_level) ? 'bg-success' : 'bg-error'">   
                      <p class="text-center pl-3">

                        {{ formatNumber(getQuantity(card.id)) }}
                        
                      </p>
                    </v-col>

                    <v-col cols="12" sm="6" class="bg-blue-darken-4 vcol">
                      <p class="text-center">
                        {{ configStore.currencyFormatter().format(card.sellingprice) }}
                      </p>

                    </v-col>

                  </v-row>
                </v-img>
              </v-card>
            </v-col>
          </v-row>

        </v-container>

      </v-col>



    </v-row>
    <v-navigation-drawer location="right" v-model="show" :rail="show" rail-width="300" scrim elevation v-if="show">
      <SalesLayout @close="loadStock(); ++key" :key="key" />
    </v-navigation-drawer>
  </div>
</template>


<script>

import { useProductStore } from '~~/store/productsStore';
import { useSalesStore } from '~~/store/sales';
import { useStockStore } from '~~/store/stocks';
import { useConfigStore } from '~~/store/config';
import { formatNumber } from '../composables/getFilters';
import { usePermissionStore } from '../store/permissions';
import { useDisplay } from 'vuetify/lib/framework.mjs';

definePageMeta({
  middleware: [
    function (to, from) {
      const permission = [
"can_add_sales"
]

      if(!usePermissionStore().hasPermission(permission)){
        configStore.alert_msg = 'You dont have access to this page'
        return abortNavigation()
      }
    },
    
  ],
});

export default {
  setup() {
    const productStore = useProductStore()
    const salesStore = useSalesStore()
    const stockStore = useStockStore()
    const configStore = useConfigStore()
    const searchTerm = ref('')
    const { $api } = useNuxtApp()
    const { lgAndUp } = useDisplay()
    const prod = ref([])
    const products = computed(() => searchTerm.value ? prod.value : productStore.products)
    const key = ref(0)
    const loaded = ref(false)
    const show = computed(() => lgAndUp.value ? true : salesStore.cart_out)

    function showProduct(ev) {
      
      //show.value = true
      salesStore.addToCart(ev)
    }

    function getQuantity(prod) {
      const a = stockStore.getStockQty(prod)
      
      return a
    }


    async function search() {
      const term = searchTerm.value
      const result = productStore.searchProduct(term)

      prod.value = result

      //return result
    }

    function loadStock(){
      $api.get('/api/stocks/getSalesStock').then((res) => {
        const result = res.data
       // productStore.updatePrice(result.stocks)
        stockStore.loadStocks(result.stocks, result.sales)
        loaded.value = true
         
      })
      .catch((err)=>{
        configStore.alert_msg = 'error loading products'
        console.log(err)
        
      })
    }

    onMounted(() => {
     loadStock()
      if (!salesStore.ledger_id) {
        salesStore.ledger_alert = true
      }

    })

    return {
      products, loaded, show, showProduct, getQuantity, configStore, search, searchTerm, loadStock, key
    }
  }
}
</script>

<style>
.vcol {
  padding: 2px 5px;
}

.vcol+.vcol {
  padding-bottom: 10px;
}
</style>