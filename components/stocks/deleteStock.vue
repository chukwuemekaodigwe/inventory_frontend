<template>

    <!-- DELETE DIALOG-->
    <v-row justify="center">
      <v-dialog v-model="deleteDialog" persistent width="300px">
        <v-card aria-multiline="true" class="px-2 py-1">
          <v-card-text multiline>
            Do you really want to delete these item?
          </v-card-text>

          <v-card-actions class="d-flex row justify-content-end">
            <v-spacer></v-spacer>
            <v-btn color="error" @click="close">Cancel</v-btn>
            <v-btn color="success" @click="deleteConfirm"> Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

</template>


<script lang="ts" setup>


import { mapState, storeToRefs } from 'pinia'
import { useConfigStore } from '../../store/config'
import { useProductStore } from '~~/store/productsStore'
import { useBranchStore } from '~~/store/branchStore'
const { $api } = useNuxtApp()
const configStore = useConfigStore()
const productStore = useProductStore()
const branchStore = useBranchStore()
const products = storeToRefs(productStore).products
const readonly = ref(true)
const transferForm = ref()
const branches = storeToRefs(branchStore).branches
const transferDialogue = ref(true)
const emit = defineEmits(['close'])
const stock = reactive({
  product: '',
  qty: '',
  branch: null,
  costprice: '',
  sellingprice: '',
  from: null,
  to: null,
  selected: [],
  removeReason: null,
})



function deleteItem(v = '') {

// if (v) {
//   let item = []
//   if (this.selected.length) {
//     item = this.selected
//     console.log(item)
//   } else {
//     item.push(v.id)
//     console.log(item)
//   }
  this.deleteDialog = true
  this.delete_item = item
} else {
  this.configStore.alert_msg = 'Please select items to delete!'
}
},

async deleteConfirm() {
const item = this.delete_item
await this.$api.post('/api/stocks/deleteStock', { 'item': item }).then((res) => {
  console.log(res.data)
  this.configStore.alert_msg = 'Successfully deleted'
  this.deleteDialog = false
})
  .catch((err) => {
    console.log(err.response)
    this.configStore.alert_msg = 'An error occured during deletion'
  })

},
</script>