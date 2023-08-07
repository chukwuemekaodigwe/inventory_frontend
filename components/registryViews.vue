<template>
  <!-- View Dialog-->
  <v-row justify="center">

    <v-dialog v-model="show" persistent width="500px">

      <v-card>
        <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
          <span class="text-subtitle-2 text-medium"> {{ title }} </span>
          <div class="d-flex align-center flex-row justify-end">
            <span class="text-caption text-right"> Date: </span>
            <v-text-field :readonly="edit" density="compact" variant="underlined" v-model="date"
              type="date"></v-text-field>


            <v-btn color="primary" v-if="!salesStore.ledger_id" size="x-small" class="text-right" icon="mdi-pencil" @click="edit = false"></v-btn>

            <v-btn color="error" v-if="salesStore.ledger_id" size="x-small" class="text-right" icon="mdi-close"
              @click="close()"></v-btn>

          </div>
          
        </v-card-title>
        <span class="px-4"> Ledger Id : {{ ledger.registry.reg_code }}</span>
        <v-divider></v-divider>

        <v-card-text>
          <v-form validate-on="blur" ref="viewForm">
            <v-row v-if="!salesStore.ledger_id">
              <v-col cols="12" md="12">
                <v-textarea type="number" variant="outlined" v-model="open" :model-value="opening" rows="1" :readonly="edit" density="compact"
                  color="info" label="Opening Cash">
                </v-textarea>
              </v-col>
              <v-col>
                <v-textarea v-if="!edit" rows="3" variant="outlined" label="Reason for the change"
                  v-model="reason"></v-textarea>
              </v-col>
            </v-row>
            <v-row v-else class="d-flex flex-column">
              <v-row>
                <v-col>
                  <v-table density="compact">
                    <thead>
                      <tr class="font-weight-bold">
                        <td class="bg-blue-lighten-3 text-left"> Opening Ledger Balance</td>
                        <th class="bg-green-lighten-3 text-right"> {{ configStore.currencyFormatter().format(ledger.registry.opening_amt) }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-grey">
                        <th colspan="2" class="bg-primary-lighten-2"> Debit/Income</th>
                      </tr>
                      <tr>
                        <th colspan="2" class="fontsize-1 text-caption"> Sales Revenue</th>
                      </tr>
                      <tr>
                        <th class="text-left"> Cash Payments</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.cash) }}
                        </th>
                      </tr>
                      <tr>
                        <th class="text-left"> Bank Payments</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.bank) }}
                        </th>
                      </tr>
                      <tr>
                        <th class="text-left"> Cheques Payments</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.cheque) }}
                        </th>
                      </tr>

                      <tr>
                        <th class="text-left">Debts </th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.debts) }}
                        </th>
                      </tr>

                      <tr class="bg-grey-lighten-3">
                        <th class="text-left"> Total Sales</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(total_sales) }}
                        </th>
                      </tr>

                      <tr>
                        <th class="text-left"> Payments Received</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.receive_payments) }}
                        </th>
                      </tr>

                      <tr>
                        <th class="text-left"> Other Income</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.incomes) }} </th>
                      </tr>

                      <tr class="bg-grey-lighten-4">
                        <th class="text-left"> Total Income</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(total_income) }}
                        </th>
                      </tr>
                      
                      <tr>
                        <th colspan="2" class="bg-primary-lighten-2"> Credit/Expenses </th>
                      </tr>
                      <tr>
                        <th class="text-left"> General Expenses</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.expenses) }}
                        </th>
                      </tr>
                      <tr>
                        <th class="text-left"> Goods Refunds</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.returns) }}
                        </th>
                      </tr>
                      <tr>
                        <th class="text-left"> Funds Transfer to Bank</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.transfer) }}
                        </th>
                      </tr>

                      <tr>
                        <th class="text-left"> Bank Payments From Sales</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.bank) }}
                        </th>
                      </tr>
                      <tr>
                        <th class="text-left"> Cheques Payments From Sales</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.cheque) }}
                        </th>
                      </tr>
                      <tr class="bg-grey-lighten-3">
                        <th class="text-left"> Total Credit/Expenses</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(total_exp) }}
                        </th>
                      </tr>

                      <tr>
                        <td></td>
                        <td></td>
                      </tr>


                    </tbody>
                    <tfoot>
                      <tr class="font-weight-bold">

                        <td class="bg-blue-lighten-3 text-left"> Closing Ledger Balance </td>
                        <th class="bg-green-lighten-3 text-left"> {{ configStore.currencyFormatter().format(close_ledger + parseFloat(ledger.debts)) }}
                        </th>
                      </tr>
                    </tfoot>
                  </v-table>
                </v-col>
              </v-row>

              <v-row class="d-block">

                <v-table density="compact">
                  <thead>
                    <tr>
                      <th colspan="2" class="text-caption">Account Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="text-info">
                      <th>Opening Balance</th>
                      <td class="text-right">{{ configStore.currencyFormatter().format(ledger.registry.opening_amt) }}</td>
                    </tr>

                    <tr class="text-info">
                        <th class="text-left"> Total Debit/Income</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(total_income) }}
                        </th>
                      </tr>
                      
                      
                      <tr class="text-red">
                        <th class="text-left"> Total Credit/Expense</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(total_exp) }}
                        </th>
                      </tr>
                      
                      <tr class="text-red">
                        <th class="text-left"> Debts</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.debts) }}
                        </th>
                      </tr>
                    
                      <tr class="bg-primary-lighten-2">
                      <th>Closing Cash Balance</th>
                      <td class="text-right">{{ configStore.currencyFormatter().format(close_ledger) }}</td>
                    </tr>

                    
                  </tbody>
                </v-table>

              </v-row>

              <v-divider class="my-5"></v-divider>
              <v-row>
                <v-col>
                  <v-textarea rows="3" variant="outlined" label="Closing Remarks" v-model="reason"></v-textarea>
                </v-col>
                <v-col cols="12">
                  <small><i class="text-caption">If correct, please confirm by typing your username/email</i></small>
                  <v-text-field class="w-100" v-model="confirm" density="compact"
                    placeholder="confirmation"></v-text-field>
                </v-col>
              </v-row>

            </v-row>
          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" v-if="salesStore.ledger_id" variant="text" @click="close">
            Back
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="salesStore.ledger_id ? closeReg() : openReg()">
            Submit
          </v-btn>

        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">

import { useStockStore } from '../store/stocks'
import { useSalesStore } from '../store/sales'
import { useConfigStore } from '~~/store/config';
import { formatDate } from '~~/composables/getFilters';
import registryChecker from '~~/composables/registryChecker'
const { $api } = useNuxtApp()
const props = defineProps({
  'showPage': {
    default: false
  }
})

const emits = defineEmits(['close'])
const configStore = useConfigStore()
const stockStore = useStockStore()
const salesStore = useSalesStore()

const reason = ref('')
const confirm = ref('')

let edit = ref(true)
const opening = ref('')
const open = ref()
const date = ref(formatDate(new Date()))
const show = ref(true)

const total_exp = ref(0)
const total_income = ref(0)
const total_sales = ref(0)
const close_ledger = ref(0)

const title = computed(() => salesStore.ledger_id ? 'Account Ledger ' : 'New Ledger')
const ledger = ref({
  'cash': 0,
  'bank': 0,
  'cheque': 0,
  'debts': 0,
  'expenses': 0,
  'incomes': 0,
  'receive_payments': 0,
  'returns': 0,
  'transfer': 0,
  'registry': {
    'reg_code': '',
    'opening_amt': 0,
    'date_involved': '',
    'opening_note': '',
    'closing_note': ''
  },
  'total_exp': total_exp.value,
  'total_income': total_income.value,
  'total_sales': total_sales.value,
  'close_ledger': close_ledger.value
})


function close() {

  show.value = false
  emits('close', true)
}


function openReg() {
  if (!edit.value && !reason.value) {
    return configStore.alert_msg = 'Please provide the reason for the edit'
  }
console.log(open.value)
  const payload = {
    'amount': open.value,
    'date': date.value,
    'reason': reason.value
  }

  $api.post('api/registry/open', { 'data': payload }).then((res) => {
    const result = res.data.registry
    //console.log({'registr': result})
    salesStore.ledger_id = result.id
    salesStore.date = new Date(date.value)
    configStore.alert_msg = 'New Ledger successfully opened'

    close()
  })
    .catch((err) => {
      configStore.alert_msg = 'An error occurred'
      console.log(err.response)
    })

}

onBeforeUnmount(() => close())

function closeReg() {

  if (confirm.value == configStore.user?.email) {
    const payload = {
      'approve': true,
      'registry': salesStore.ledger_id,
      'ledger': ledger.value,
      'total_exp': total_exp.value,
      'total_income': total_income.value,
      'total_sales': total_sales.value,
      'closing_note': reason.value,
      'close_ledger': close_ledger.value
    }

    $api.post('api/registry/close', { 'data': payload }).then((res) => {
      configStore.alert_msg = 'Accounts Ledger Successfully closed'
      salesStore.ledger_id = undefined
      close()
    })
      .catch((err) => {
        configStore.alert_msg = `An Error occured ${err.response.data.message}`
        console.log(err)
      })
  } else {
    configStore.alert_msg = 'Please type your email as a the confirmation'
  }
}


onBeforeMount(async () => {
  await registryChecker()

})


onMounted(async () => {

  if (salesStore.ledger_id) {
    await $api.post(`/api/registry/getRegistryData/`, { 'registry_id': salesStore.ledger_id }).then((res) => {
      const result = res.data
      
      date.value = formatDate(new Date(result.registry.time_opened))

      ledger.value = result;
      total_exp.value = parseFloat(result.expenses) + parseFloat(result.returns) + parseFloat(result.transfer) + parseFloat(result.bank) + parseFloat(result.cheque)
      total_sales.value =  parseFloat(result.cash) + parseFloat(result.bank) + parseFloat(result.cheque) + parseFloat(result.debts)
      total_income.value = parseFloat(total_sales.value) + parseFloat(result.receive_payments) + parseFloat(result.incomes)

      close_ledger.value = (parseFloat(result.registry.opening_amt) + parseFloat(total_income.value)) - (parseFloat(total_exp.value) + parseFloat(result.debts))

      show.value = true
    })
      .catch((err) => {
        configStore.alert_msg = 'Error occured while loading ledger data'
        
      })
  } else {
    await $api.get('/api/registry/getOpeningBal').then((res) => {
      open.value = res.data.result
      opening.value = configStore.currencyFormatter().format(res.data.result)
    })
      .catch((err) => {
        configStore.alert_msg = 'Error occured while getting opening bal'
      })
  }

  show.value = true
})
</script>