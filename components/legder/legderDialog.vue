<template>
  <!-- View Dialog-->
  <v-row justify="center">

    <v-dialog v-model="show" persistent width="500px">

      <v-card>
        <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
          <v-chip prepend-icon="mdi-alarm" :color="!ledger.status ? 'success' : ''">
{{ ledger.status ? 'Successfully Closed' : 'Still Active' }}
          </v-chip>
          <div class="d-flex align-center flex-row justify-end">
            <span class="text-caption text-right"> Date: </span>
            <v-text-field :readonly="edit" density="compact" variant="underlined" v-model="date"
              type="date"></v-text-field>


            <!-- <v-btn color="primary" v-if="!salesStore.ledger_id" size="x-small" class="text-right" icon="mdi-pencil" @click="edit = false"></v-btn> -->

            <v-btn color="error" size="x-small" class="text-right" icon="mdi-close"
              @click="close()"></v-btn>

          </div>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-form validate-on="blur" ref="viewForm">
            <!-- <v-row v-if="!salesStore.ledger_id">
              <v-col cols="12" md="12">
                <v-textarea type="number" variant="outlined" v-model="opening" rows="1" :readonly="edit" density="compact"
                  color="info" label="Opening Cash">
                </v-textarea>
              </v-col>
              <v-col>
                <v-textarea v-if="!edit" rows="3" variant="outlined" label="Reason for the change"
                  v-model="reason"></v-textarea>
              </v-col>
            </v-row> -->
            <v-row class="d-flex flex-column">
              <v-row>
                <v-col>
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <td class="bg-blue-lighten-3"> Opening Ledger Balance</td>
                        <th class="bg-green-lighten-3 text-right"> {{ configStore.currencyFormatter().format(ledger.opening_amt) }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-grey-darken-2">
                        <th colspan="2" class=""> Debit/Income</th>
                      </tr>
                      <tr>
                        <th class="text-caption" colspan="2">Sales</th>
                      </tr>
                      <tr>
                        <th class="text-left"> Cash Payments</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.cash_sales) }}
                        </th>
                      </tr>
                      <tr>
                        <th class="text-left"> Bank Payments</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.bank_sales) }}
                        </th>
                      </tr>
                      <tr>
                        <th class="text-left"> Cheques Payments</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.cheque_sales) }}
                        </th>
                      </tr>

                      <tr>
                        <th class="text-left">Credit Sale (Debts) </th>
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
                        <th class="text-left bg-blue-lighten-3"> Total Income</th>
                        <th class="bg-green-lighten-3 text-right"> {{ configStore.currencyFormatter().format(total_income) }}
                        </th>
                      </tr>
                      <tr>
                        <th colspan="2" class="bg-grey-darken-1"> Credit/Expenses </th>
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
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.bank_sales) }}
                        </th>
                      </tr>
                      <tr>
                        <th class="text-left"> Cheques Payments From Sales</th>
                        <th class="text-right"> {{ configStore.currencyFormatter().format(ledger.cheque_sales) }}
                        </th>
                      </tr>
                      
                      <tr class="bg-blue-lighten-3">
                        <th class="text-left"> Total Credit/Expenses</th>
                        <th class="bg-green-lighten-3 text-right">
                           {{ configStore.currencyFormatter().format(total_exp) }}
                        </th>
                      </tr>

                      <tr>
                        <td></td>
                        <td></td>
                      </tr>


                    </tbody>
                    <tfoot>
                      <tr>

                        <td class="bg-blue-lighten-3"> Closing Ledger Balance </td>
                        <th class="bg-green-lighten-3 text-left"> {{ configStore.currencyFormatter().format(close_ledger + parseFloat(ledger.debts) ) }}
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
                    <tr class="text-blue">
                      <th>Opening Balance</th>
                      <td class="text-right">{{ configStore.currencyFormatter().format(ledger.opening_amt) }}</td>
                    </tr>

                    <tr class="text-blue">
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
                    
                    <tr class="bg-grey-lighten-2">
                      <th class="font-weight-bold">Closing Cash Balance</th>
                      <td class="font-weight-bold text-right">{{ configStore.currencyFormatter().format(close_ledger) }}</td>
                    </tr>

                    <tr class="bg-grey-lighten-3">
                      <td>
                        Ledger Id : </td>
                      <td>
                        <i>{{ ledger.reg_code }}</i>
                      </td>
                    </tr>
                  </tbody>
                </v-table>


              </v-row>

              
              <v-divider class="my-5"></v-divider>
              <v-row>

                <v-col cols="6">
                  <v-text-field readonly density="compact" variant="outlined" label="Opened By" :model-value="getEmployeeName(ledger.opened_by)"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field readonly density="compact" variant="outlined" label="Closed By" :model-value="getEmployeeName(ledger.closed_by)"></v-text-field>
                </v-col>
                <v-col>
                  <v-textarea readonly rows="1" variant="outlined" label="Opening Remarks"
                    :model-value="ledger.opening_note"></v-textarea>
                </v-col>
                <v-col>
                  <v-textarea readonly rows="1" variant="outlined" label="Closing Remarks"
                    :model-value="ledger.closing_note"></v-textarea>
                </v-col>

              </v-row>
            </v-row>
          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">
            Close
          </v-btn>
          <!-- <v-btn color="blue-darken-1" variant="text" @click="salesStore.ledger_id ? closeReg() : openReg()">
            Submit
          </v-btn> -->

        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">

import { useUsersStore } from '../../store/users'
import { useSalesStore } from '../../store/sales'
import { useConfigStore } from '../../store/config';
import { formatDate } from '../../composables/getFilters';
import registryChecker from '../../composables/registryChecker'
const { $api } = useNuxtApp()
const props = defineProps({
  'showPage': {
    default: false
  },
  'items': {}
})

const emits = defineEmits(['close'])
const configStore = useConfigStore()
const usersStore = useUsersStore()
const salesStore = useSalesStore()

const reason = ref('')
const confirm = ref('')

let edit = ref(true)
const opening = ref('')
const date = ref(formatDate(new Date()))
const show = ref(true)

const total_exp = ref(0)
const total_income = ref(0)
const total_sales = ref(0)
const close_ledger = ref(0)

const title = computed(() => '')
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

function getEmployeeName(id:number){
  return usersStore.getUserById(id)?.name
}

async function openReg() {
  if (!edit.value && !reason.value) {
    return configStore.alert_msg = 'Please provide the reason for the edit'
  }
  const payload = {
    'amount': opening.value,
    'date': date.value,
    'reason': reason.value
  }

  await $api.post('api/registry/open', { 'data': payload }).then((res) => {
    const result = res.data.registry
    
    salesStore.ledger_id = result.id
    configStore.alert_msg = 'New Ledger successfully opened'

    close()
  })
    .catch((err) => {
      configStore.alert_msg = 'An error occurred'
      console.log(err.response)
    })

}

onBeforeUnmount(() => close())

onMounted(async () => {

    await $api.post(`/api/registry/getRegistryData/`, { 'registry_id': props.items.item.id }).then((res) => {     
      const result = props.items.item
      date.value = formatDate(new Date(result.time_opened))

      ledger.value = result; const a = result.cash_sales ? result.cash_sales : 0
      total_exp.value = parseFloat(result.expenses) + parseFloat(result.returns) + parseFloat(result.transfer) + parseFloat(result.bank_sales) + parseFloat(result.cheque_sales)
      total_sales.value = parseFloat(a) + parseFloat(result.bank_sales) + parseFloat(result.cheque_sales) + parseFloat(result.debts)
      total_income.value = parseFloat(total_sales.value) + parseFloat(result.receive_payments) + parseFloat(result.incomes)
      close_ledger.value = (parseFloat(result.opening_amt) + parseFloat(total_income.value)) - (parseFloat(total_exp.value) + parseFloat(result.debts))
       show.value = true
       console.log(result.cash_sales)
    })

      .catch((err) => {
        configStore.alert_msg = 'Error occured while loading ledger data'
        console.log(err)
      })
  
})
</script>