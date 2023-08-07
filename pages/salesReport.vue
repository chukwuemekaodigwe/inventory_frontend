<template>
  <v-sheet class="m-0 m-n2" elevation="6">

    <v-toolbar class="mb-1 pl-5">

      <v-btn size="small" v-if="isHistory" @click="getSummary" outlined="true" color="primary" prepend-icon="mdi-forward">
        Show Summary</v-btn>
      <span><v-btn size="small" v-if="!isHistory" @click="isHistory = true" color="primary" prepend-icon="mdi-forward">
          Back to History </v-btn></span>
      <v-spacer></v-spacer>
      <span class="text-subtitle-2 text-center text-uppercase"> {{ filter_title }} </span>
      <v-spacer></v-spacer>
      <v-text-field @update:model-value="getSearchResult" v-model="search"
        :placeholder="isHistory ? 'search by customer, invoice no or amount ' : 'Search by product name or sku'"
        append-inner-icon="mdi-magnify" label="Search" single-line hide-details>
      </v-text-field>
    </v-toolbar>

    <v-data-table classs="px-5" :headers="isHistory ? headers : headers2" :items="isHistory ? desserts : desserts2"
      :sort-by="[{ key: 'date', order: 'desc' }]" class="elevation-1" v-model="selected"
      :items-per-page="configStore.tablePager.perPage" show-select :loading="loading">
      <template v-slot:top>
        <v-toolbar class="flex px-3 bg-white border-1" density="compact">
          <v-btn prepend-icon="mdi-filter" size="xl" color="primary"></v-btn> &nbsp; &nbsp;
          <v-autocomplete label="This Week" :items="days" item-title="name" item-value="dates" v-model="searchKeys.day"
            @update:model-value="getByDay" variant="underlined" hint="Pick a day within this week"
            return-object></v-autocomplete>

          <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>

          <v-autocomplete label="By Year" type="number" min="2000" v-model="searchKeys.year" :items="years"
            @update:model-value="getByYear" placeholder="select a year" variant="underlined"></v-autocomplete>
          <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>

          <v-autocomplete label="By Month" :items="months" item-title="name" item-value="value" v-model="searchKeys.month"
            @update:model-value="getByMonth" variant="underlined" persistent-hint return-object
            hint="Pick a month within the selected year"></v-autocomplete>

          <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>
          <!-- <i></i><v-tooltip activator="props" location="right">Filter result by any of th options</v-tooltip> -->

          <v-text-field type="date" v-model="searchKeys.start_date" label="Single Date / Start Date"
            @update:model-value="getByDate" variant="underlined"></v-text-field>
          <v-divider :inset="true" vertical thickness="1" class="mx-5"></v-divider>
          <v-text-field type="date" v-model="searchKeys.end_date" label="End Date" variant="underlined"
            @update:model-value="getByRange"></v-text-field>

          -
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }" v-if="isHistory">
        <v-icon size="small" class="me-2" @click="showItem(item.raw)">
          mdi-eye
        </v-icon>
        <!-- <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon> -->
        <v-icon size="small" @click="deleteItem(item.raw)">
          mdi-delete
        </v-icon>
      </template>

      <template v-slot:bottom v-if="isHistory">
        <div class="text-center pt-2 d-flex" style="flex-flow: row wrap; justify-content: space-around;">
          <v-pagination v-model="page" @update:model-value="loadItems" :length="configStore.tablePager.totalItems"
            :start="configStore.tablePager.startItem" :show-first-last-page="true"></v-pagination>

        </div>
      </template>
    </v-data-table>

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


    <v-row justify="center">
      <v-dialog v-model="deleteDialog" persistent width="300px">
        <v-card aria-multiline="true" class="px-2 py-1">
          <v-card-text multiline>
            Do you really want to delete these items?
          </v-card-text>

          <v-card-actions class="d-flex row justify-content-end">
            <v-spacer></v-spacer>
            <v-btn color="error" @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="success" @click="deleteConfirm"> Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

  </v-sheet>
</template>

<script>
import { useConfigStore } from '~~/store/config'
import { getDaysWithDates, formatDate, getYears } from '~~/composables/getFilters'
import { isArray, isObject } from '@vue/shared'
import { useBranchStore } from "../store/branchStore";
import { useUsersStore } from "../store/users";
import { useCustomerStore } from "../store/customers";
import { useProductStore } from "../store/productsStore";


const { $api } = useNuxtApp()

export default {
  data() {
    return {
      configStore: useConfigStore(),
      customerStore: useCustomerStore(),
      productStore: useProductStore(),
      usersStore: useUsersStore(),
      branchStore: useBranchStore(),
      selected: [],
      isHistory: true,
      viewDialog: false,
      viewForm: false,
      deleteDialog: false,
      delete_item: [],
      loading: true,
      search: '',
      options: {},
      ttl: 0,
      page: 1,
      readonly: true,
      stock: {},
      headers: [
        {
          title: 'Date',
          align: 'start',
          sortable: true,
          key: 'date',
        },
        { title: 'OrderNo', key: 'order_no' },
        { title: 'Invoice No', key: 'invoice_no' },
        { title: 'Customer Name', key: 'customer' },
        { title: 'No of Items', key: 'no_items' },
        { title: 'Total', key: 'total' },
        { title: 'Amount Paid', key: 'paid' },
        { title: 'To Be Paid', key: 'due' },
        //{ title: 'Method', key: 'payment_method' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      headers2: [
        {
          title: 'S/N',
          align: 'start',
          sortable: true,
          key: 'sn',
        },

        { title: 'Product', key: 'product' },
        { title: 'SKU', key: 'product_sku' },
        { title: 'Qty Sold', key: 'total_sold' },
        { title: 'Gross Profit', key: 'gross_total' },
        { title: 'Net Profit', key: 'profit' },
        // { title: 'Actions', key: 'actions', sortable: false },
      ],

      years: getYears(new Date().getFullYear()),
      months: getMonthsWithNumeric(),
      days: getDaysWithDates(),

      filter_title: '',
      searchKeys: reactive({
        year: new Date().getFullYear(),
        month: '',
        day: '',
        start_date: formatDate(new Date()),
        end_date: formatDate(new Date()),
        summary: ref(this.isHistory).value
      }),

      /**** */
      desserts: [],
      desserts2: [],
      editedIndex: -1,
      editedItem: {
        date: '',
        total: 0,
        invoice_no: 0,
        customer: '',
        no_items: 0,
        paid: 0,
        due: '',
        //   payment_method: '',
      },
      defaultItem: {
        date: '',
        total: 0,
        invoice_no: 0,
        customer: '',
        no_items: 0,
        paid: 0,
        due: '',
        // payment_method: ''
      },
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    options: {
      handler() {
        //this.getDataFromApi()
        console.log('hie')
      },
      deep: true,
    },
  },

  created() {
    this.initialize()

  },

  methods: {
    loadItems(ev) {
      console.log(ev)
      const path = `${this.configStore.tablePager.pageUrl}?page=${ev}`
      if (this.isHistory) {
        this.$api.post(path, this.searchKeys).then((res) => {
          const result = res.data.orders
          //console.log({ 'fromLoader': result })
          this.initialize(result)
        })
          .catch((err) => { this.configStore.alert_msg = `An error occurred`; console.log(err); })
      } else {
        this.$api.post(path, this.searchKeys).then((res) => {
          const result = res.data.orders
          this.getSummary(result)
        })
          .catch((err) => { this.configStore.alert_msg = `An error occurred`; console.log(err); })
      }

    },

    getByMonth() {

      const data = {
        'year': this.$data.searchKeys.year,
        'month': parseInt(this.$data.searchKeys.month.value) + 1,
        'summary': this.isHistory ? false : true
      }
      this.filter_title = `Filter result for month: ${this.$data.searchKeys.month.name}, ${data.year}`


      this.$api.post('api/orders/getSalesByMonth', data).then((res) => {

        const result = res.data.orders
    
        // if (isArray(result) && (result.length > 0)){
        this.isHistory ? this.initialize(result) : this.getSummary(result)
        // }else{
        //   this.configStore.alert_msg = 'No records found'
        // }
      })
        .catch((err) => {
          console.log(err)
          this.configStore.alert_msg = ' An error occured, please try again'
        })
    },

    getByYear() {
      const data = {
        'year': this.$data.searchKeys.year,
        'summary': this.isHistory ? false : true
      }

      this.filter_title = `Filter result for year: ${data.year}`
      this.$api.post('api/orders/getSalesByYear', data).then((res) => {

        const result = res.data.orders
        console.log(result)
        this.isHistory ? this.initialize(result) : this.getSummary(result)
      })
        .catch((err) => {
          console.log(err)
          this.configStore.alert_msg = ' An error occured, please try again'
        })
    },

    getByDay() {
      const date = this.$data.searchKeys.day.date

      this.filter_title = `Filter result for day: ${this.$data.searchKeys.day.name}, ${new Date(date).toLocaleDateString('en-gb')}`
      //console.log(formatDate(date))
      this.$api.post('api/orders/getSalesByDate', { 'date': date, 'summary': this.isHistory ? false : true }).then((res) => {

        const result = res.data.orders
        //console.log(result)
        if (this.isHistory) {
          this.initialize(result)
        } else {
          this.getSummary(result)
        }

      })
        .catch((err) => {
          console.log(err)
          this.configStore.alert_msg = ' An error occured, please try again'
        })
    },

    getByDate() {
      const data = {
        'date': this.$data.searchKeys.start_date,
        'summary': this.isHistory ? false : true
      }
      this.filter_title = `Filter result for date: ${new Date(data.date).toLocaleDateString('en-gb')}`

      this.$api.post('api/orders/getSalesByDate', data).then((res) => {

        const result = res.data.orders
        // console.log(result)
        this.isHistory ? this.initialize(result) : this.getSummary(result)
      })
        .catch((err) => {
          console.log(err)
          this.configStore.alert_msg = ' An error occured, please try again'
        })
    },

    getByRange() {
      const data = {
        'start': this.$data.searchKeys.start_date,
        'end': this.$data.searchKeys.end_date,
        'summary': this.isHistory ? false : true
      }
      this.filter_title = `Filter result for dates from : ${data.start} to ${data.end}`
      console.log(data)
      this.$api.post('api/orders/getSalesByRange', data).then((res) => {

        const result = res.data.orders
        console.log(result)
        this.isHistory ? this.initialize(result) : this.getSummary(result)
      })
        .catch((err) => {
          console.log(err)
          this.configStore.alert_msg = ' An error occured, please try again'
        })
    },

    async getSummary(payloads) {
      this.isHistory = false;
      this.configStore.tablePager.perPage = 10
      let result = []

      if (!isArray(payloads)) {
        await this.$api.post('api/orders/getOrderSummary',
          { headers: { "Content-Type": 'application/json' } })
          .then((res) => {
            result = res.data.orders

            //console.log(result)
          })

          .catch((err) => { this.configStore.alert_msg = `An error occurred`; console.log(err); })

      } else {
        result = payloads
      }

      let i = 1;
      //console.log(result)
      const items = []
      result.forEach((el) => {
        let a = {
          'sn': i++,
          'product': el.name,
          'product_sku': el.sku,
          'total_sold': parseInt((el.qty).toLocaleString()).toFixed(2),
          'gross_total': parseInt((el.gross).toLocaleString('en-gb')).toFixed(2),
          'profit': parseInt(el.profit).toFixed(2),
          'no_items': el.no_items
        }

        //console.log(a)
        items.push(a)

      })
      this.$data.desserts2 = items

      return (this.$data.desserts);

    },

    async searchSummary() {
      const searchKey = this.search
      await this.$api.post('api/orders/searchSummary', { 'searchKey': searchKey }).then((res) => {
        //console.log({ 'result': res.data })
        this.getSummary(res.data.orders)

      })
        .catch((err) => {
          console.log(err.response.data)
          this.configStore.alert_msg = 'An error Occurred'
        })
    },

    async getSearchResult() {
      this.filter_title = `Search Results`
      if (!this.isHistory) {
        this.searchSummary()
      } else {
        const searchKey = this.search
        await this.$api.post('api/orders/search', { 'searchKey': searchKey }).then((res) => {
          //console.log({ 'result': res.data.orders })
          this.initialize(res.data.orders)
        })
          .catch((err) => {
            console.log(err.response.data)
            this.configStore.alert_msg = 'An error Occurred'
          })
      }
    },

    async initialize(payloads) {
      let result = []
      console.log(this.configStore.branch.id)
      if (!isObject(payloads)) {
        await this.$api.post('api/orders/getSalesOrder',
          { headers: { "Content-Type": 'application/json' } })
          .then((res) => {
            result = res.data.orders
            //      console.log(result)
          })
          .catch((err) => { this.configStore.alert_msg = `An error occurred`; console.log(err); })

      } else {
        result = payloads
      }

      const items = []
      await this.configStore.updatePaginator(result)
      
      result.data.forEach((el) => {
        //      console.log(el)
        let a = {
          'date': new Date(el.created_at).toLocaleDateString('en-gb'),
          'invoice_no': el.invoice_no,
          'order_no': el.order_no,
          'customer': el.name,
          'total': parseInt(el.total).toLocaleString('en-gb'),
          'paid': parseInt(el.amount_paid).toLocaleString('en-gb'),
          'due': parseInt(el.remainder).toFixed(2),
          'no_items': el.no_items,
          'id': el.id,
          'item': el
        }

        items.push(a)

      })
      this.$data.desserts = items
    },

    showItem(item) {
      this.stock = item.item
      this.stock.branch = this.branchStore.getBranchById(item.branch_id)
      this.stock.employee = item.customer
      this.$api.post(`/api/orders/getOrderSales/`, { 'order': item.id }).then((res) => {
        this.stock.sales = res.data.sales
          console.log(this.stock)
      })
        .catch((err) => {
          this.configStore.alert_msg = 'An error occured while fetching sales'
          console.log(err.response.data.message)
        })

      this.viewDialog = true
    },

    getColor(item) {
      let color = ''
      if (item == 1) {
        color = 'primary'
      } else if (item == 2) {
        color = 'success'
      } else {
        color = 'error'
      }

      return color
    },
    close(v) {
      if (!v) {
        this.$refs.viewForm.reset(); this.viewDialog = false;
      } else {
        this.deleteDialog = false;
      }
    },

    deleteItem(v) {

      if (v) {
        let item = []
        if (this.selected.length) {
          item = this.selected

        } else {
          item.push(v.id)

        }

        this.deleteDialog = true
        this.delete_item = item
      } else {
        this.configStore.alert_msg = 'Please select items to delete!'
      }
    },

    async deleteConfirm() {
      const item = this.delete_item
      await this.$api.post('/api/orders/deleteOrder', { 'item': item }).then((res) => {
        console.log(res.data)
        this.configStore.alert_msg = 'Successfully deleted'
        this.deleteDialog = false
        this.initialize()
      })
        .catch((err) => {

          this.configStore.alert_msg = 'An error occured during deletion'
        })

    },


    getProductName(id) {
      const customer = this.productStore.getProductById(id)
      
      return customer.name;
    },

    getBranchName(id) {
     // const customer = this.branchStore.getBranchById(id);
      //console.log(this.branchStore)
     //return customer;
    },

  },


}

</script>