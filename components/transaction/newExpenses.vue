<template>
  <!-- expense -->

  <v-row justify="center">
    <v-dialog v-model="expenseDialog" persistent width="500px">

      <v-card>
        <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
          <span class="text-subtitle-2 text-uppercase"> New Expense </span>

          <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close('expenses')"></v-btn>

        </v-card-title>
        <v-card-text>
          <v-form validate-on="blur" ref="stockForm">
            <v-row>
              <v-col cols="12">
                <v-text-field label="Title" variant="outlined" v-model="item.title"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="Brief Description" variant="outlined" v-model="item.desc"></v-textarea>
              </v-col>

              <v-col cols="6" md="6">
                <v-text-field label="Amount" variant="outlined" type="number" step="0.00001"
                  v-model="item.amount"></v-text-field>
              </v-col>
              <v-col cols="6" md="6">
                <v-select variant="outlined" min="0" label="Payment Method" v-model="item.p_method"
                  required :items="['Bank', 'Cheque', 'Cash']"></v-select>
              </v-col>


            </v-row>

          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close()">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveExpenses">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script lang="ts" setup>
import { useConfigStore } from '~~/store/config'
import { useSalesStore } from '~~/store/sales'
import { useBranchStore } from '~~/store/branchStore'

const emit = defineEmits(['close'])
const { $api } = useNuxtApp()
const configStore = useConfigStore()
const branchStore = useBranchStore()
const salesStore = useSalesStore()


const expenseDialog = ref(false)
let item = reactive({
  title: '',
  desc: '',
  amount: undefined,
  p_method: '',
  acct_no: '',
  acct_name: null,
  bank: null,
  selected: null,
  type: null,
})


function saveExpenses() {
  if (salesStore.ledger_id) {
    if (item.title && item.amount && item.p_method) {
        const a = item
        a.registry = salesStore.ledger_id
        a.type = 'expenses'
        console.log(a)
        $api.post('api/expenses/saveExpense', { 'data': a })
          .then((res) => {
            configStore.alert_msg = 'Successfully Saved'
            console.log(res)
            close()
          })
          .catch((err) => {
            console.log(err)
            configStore.alert_msg = 'An error Occurred'
          })
      } else {
        configStore.alert_msg = 'Please fillup the form'
      }
  } else {
    salesStore.ledger_alert = true
    //configStore.alert_msg = 'Please you need to open a ledger to perform this task'

  }
}

function close() {
  expenseDialog.value = false
  emit('close', true)

}
onMounted(() => {
  expenseDialog.value = true
})
</script>