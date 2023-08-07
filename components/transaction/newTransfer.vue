<template>
  <v-row justify="center">
    <!-- Fund transfer  -->
    <v-dialog v-model="transferDialog" persistent width="500px">
      <v-card>
        <v-card-title class="d-flex align-center" style="flex-flow: row nowrap; justify-content: space-between;">
          <span class="text-subtitle-2  text-uppercase"> Funds Transfer </span>

          <v-btn color="error" size="x-small" class="text-right" icon="mdi-close" @click="close('transfer')"></v-btn>

        </v-card-title>
        <v-card-text>
          <v-form validate-on="blur" ref="stockForm">
            <v-row>
              <v-col cols="12">
                <v-text-field label="Title" variant="outlined" v-model="item.title"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select variant="outlined" min="0" v-model="item.selected" label="Type" required
                  :items="['Individual Account', 'Company Account']"></v-select>
              </v-col>

              <v-col cols="6" md="6">
                <v-text-field label="Amount" variant="outlined" type="number" v-model="item.amount"
                  step="0.00001"></v-text-field>
              </v-col>
              <v-col cols="6" md="6">
                <v-select variant="outlined" min="0" v-model="item.p_method" label="Payment Method" required
                  :items="['Bank', 'Cheque', 'Cash']"></v-select>
              </v-col>
              <v-divider class="my-5"></v-divider>
              <v-col cols="6" md="6">
                <v-text-field label="Account Name" variant="outlined" v-model="item.acct_name"></v-text-field>
              </v-col>
              <v-col cols="6" md="6">
                <v-text-field variant="outlined" type="number" min="0" v-model="item.acct_no" label="Account No"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field label="Bank Name" variant="outlined" v-model="item.bank"></v-text-field>
              </v-col>
            </v-row>

          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close()">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveTransfer">
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


const transferDialog = ref(false)
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



function saveTransfer() {
  if (salesStore.ledger_id) {
    if (item.title && item.amount) {
      const a = item
      a.registry = salesStore.ledger_id
      
      a.desc = `fund transfer to ${a.acct_name} (${a.acct_no})`
      a.type = 'fund transfer'
      a.misc = {
        'acct_no': a.acct_no,
        'acct_name': a.acct_name,
        'bank': a.bank
      }
      
      $api.post('api/expenses/saveExpense', { 'data': a })
        .then((res) => {
          configStore.alert_msg = 'Successfully Saved'
          console.log(res)
          close('transfer')
        })
        .catch((err) => {
          console.log(err.response)
          configStore.alert_msg = 'An error Occurred'
        })
    } else {
      configStore.alert_msg = 'Please fill up the form fields'
    }
  } else {
    //salesStore.ledger_alert = true
    configStore.alert_msg = 'Please you need to open a ledger to perform this task'

  }
}


function close() {
  transferDialog.value = false

  emit('close', true)

}
onMounted(() => {
  transferDialog.value = true
})
</script>