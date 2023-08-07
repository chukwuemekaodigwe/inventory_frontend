<template>
  <div class="text-center">
    <v-menu>
      
      <template v-slot:activator="{ props: menu }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn prepend-icon="mdi-book-open-page-variant" size="small" variant="tonal" v-bind="mergeProps(menu, tooltip)">
              {{ configStore.branch.title }}
            </v-btn>
          </template>
         
        
          <span> Toogle Branch</span>
        </v-tooltip>
      </template>
     
      <v-list select-strategy="classic">
        <v-list-item v-for="(item, index) in branchStore.getBranches" :key="index" @click="changeBranch(item)"
          density="compact">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
        <!-- View Dialog-->
        <v-row justify="center">

<v-dialog v-model="viewDialog" persistent width="500px">

  <v-card>
    <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
      <span class="text-subtitle-2 text-medium"> OrderId: {{ stock.order_no }}</span>
      <span class="text-caption text-right"> Date: {{ new Date(stock.created_at).toLocaleString() }}</span>
      <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close()"></v-btn>

    </v-card-title>
    <v-divider></v-divider>

    <v-card-text>
      <v-form validate-on="blur" ref="viewForm">
        <v-row class="">
          <v-col cols="6" md="6">
            <v-textarea variant="outlined" rows="1" readonly density="compact" :model-value="stock.name" color="info" label="Customer Name">
                                </v-textarea>
          </v-col>
          <v-col cols="6" md="6">
            <v-textarea variant="outlined" rows="1" readonly density="compact" :model-value="stock.phone" color="info" label="Phone No">
            </v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-textarea variant="outlined" class="text-capitalize" rows="1" readonly density="compact" 
              label="Address*" :model-value="stock.address">
              </v-textarea>

          </v-col>
        </v-row>

        <v-divider thickness="1" class="mt-6"></v-divider>
        <v-row>
          <v-col>
            <v-table density="compact">
              <thead class="bg-grey-lighten-4">
                <tr>
                  <th class="text-left">
                    Product
                  </th>
                  <th class="text-left">
                    Quantity
                  </th>
                  <th class="text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in stock.sales" :key="item.id">
                  <td>{{ getProductName(item.product_id) }} </td>
                  <td class="text-left">{{ item.qty }}</td>
                  <th class="text-right"> {{ configStore.company.currency }} {{ (item.price *
                    item.qty).toLocaleString() }}

                  </th>
                </tr>

              </tbody>
              <tfoot>
                <tr>

                  <td class="bg-blue-lighten-3 text-right" colspan="2"> Total</td>
                  <th class="bg-green-lighten-3"> {{ configStore.company.currency }} {{ stock.total }}
                  </th>
                </tr>
              </tfoot>
            </v-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-table density="none">
              <thead class="bg-grey-lighten-4">
                <tr>
                  <th colspan="3" class="text-center">
                    Payment
                  </th>

                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in (JSON.parse(stock.payments))" :key="index">
                  <td class="text-capitalize"> {{ index }}</td>
                  <th colspan="2" class=" text-right"> {{ configStore.company.currency }} {{ item ?
                    item.toLocaleString() : 0 }}
                  </th>
                </tr>

                <tr>
                  <td class="">% Discount</td>
                  <th colspan="2" class=" text-right"> {{ stock.discount }}
                  </th>
                </tr>
              </tbody>
              <tfoot>
                <tr>

                  <td class="bg-blue-lighten-3 "> Total Paid</td>
                  <th colspan="2" class="bg-black text-right"> {{ configStore.company.currency }}
                    {{ stock.amount_paid.toLocaleString() }}
                  </th>
                </tr>

                <tr>

                  <td class="bg-blue-lighten-3 ">Balance</td>
                  <th colspan="2" class="bg-green-lighten-3 text-right"> {{ configStore.company.currency }} {{
                    stock.remainder.toFixed(2) }}
                  </th>
                </tr>

              </tfoot>
            </v-table>
          </v-col>
        </v-row>
        <!-- 

        <v-row>
          <v-col cols="6" md="6">
            <v-textarea variant="outlined" rows="1" readonly density="compact"  color="info" label="Total Paid">
            </v-textarea>
          </v-col>
          <v-col cols="6" md="6">
            <v-textarea variant="outlined" rows="1" readonly density="compact"  color="info" label="Balance">
            </v-textarea>
          </v-col>
        </v-row> -->

        <v-divider thickness="1" class="mt-6"></v-divider>
        <v-row>
          <v-col cols="6" md="6">
            <v-textarea variant="outlined" rows="1" readonly density="compact" color="info" label="Sold By" :model-value="stock.employee">
              
            </v-textarea>
          </v-col>
          <v-col cols="6" md="6">
            <v-textarea variant="outlined" rows="1" readonly density="compact" color="info" label="Office Address" :model-value="stock.branch">
            </v-textarea>
          </v-col>
        </v-row>

        <v-divider class="my-2"></v-divider>
        <v-row>

          <v-col cols="6">
            <small>Status: &nbsp;</small>

          </v-col>
        </v-row>
        <v-divider class="my-2"></v-divider>


      </v-form>

    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="close">
        Close
      </v-btn>

    </v-card-actions>
  </v-card>
</v-dialog>
</v-row>


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

