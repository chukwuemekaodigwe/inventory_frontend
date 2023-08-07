<template>
    <v-container>
        <!-- This component is handling viewing , editing of transactions -->

        <v-row justify="center">
            <v-dialog v-model="dialog" persistent width="500px">

                <v-card>
                    <v-card-title class="d-flex align-center"
                        style="flex-flow: row nowrap; justify-content: space-between;">
                        <span class="text-subtitle2 text-uppercase"> {{ dialogTitle }} </span>
                        <span>
                            <v-btn color="info" size="x-small" class="text-right" icon="mdi-pencil"
                                @click="readonly = false"></v-btn>
                            <v-btn color="error" size="x-small" class="text-right" icon="mdi-close"
                                @click="close('other')"></v-btn>
                        </span>

                    </v-card-title>
                    <v-card-text>
                        <v-form validate-on="blur" ref="otherForm">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Title" variant="outlined" :readonly="readonly"
                                        v-model="item.title"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea label="Brief Description" variant="outlined" :readonly="readonly"
                                        v-model="item.reason"></v-textarea>
                                </v-col>

                                <v-col cols="6" md="6">
                                    <v-text-field label="Amount" variant="outlined" :readonly="readonly" type="number"
                                        step="0.00001" v-model="item.item.amount"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field v-if="readonly" label="Payment Method" variant="outlined"
                                        :readonly="readonly" v-model="item.method"></v-text-field>

                                    <v-select v-else variant="outlined" :readonly="readonly" min="0" label="Payment Method"
                                        v-model="item.p_method" required
                                        :items="['Bank', 'ATM/POS', 'Cheque', 'Cash']"></v-select>
                                </v-col>


                            </v-row>

                        </v-form>

                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red-darken-1" @click="close('other')">
                            Close
                        </v-btn>
                        <v-btn color="blue-darken-1" v-if="!readonly" @click="saveEdit">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>

        <!-- Fund transfer  -->
        <v-row justify="center">
            <v-dialog v-model="transferDialog" persistent width="500px">
                <v-card>
                    <v-card-title class="d-flex align-center"
                        style="flex-flow: row nowrap; justify-content: space-between;">
                        <span class="text-medium  text-uppercase"> Funds Transfer </span>

                        <span>
                            <v-btn color="info" size="x-small" class="text-right" icon="mdi-pencil"
                                @click="readonly = false"></v-btn>
                            <v-btn color="error" size="x-small" class="text-right" icon="mdi-close"
                                @click="close('transfer')"></v-btn>
                        </span>
                    </v-card-title>
                    <v-card-text>
                        <v-form validate-on="blur" ref="stockForm">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Title" variant="outlined" :readonly="readonly"
                                        v-model="item.title"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-if="readonly" label="Type" variant="outlined" :readonly="readonly"
                                        v-model="item.type"></v-text-field>

                                    <v-select v-else variant="outlined" :readonly="readonly" min="0" v-model="item.selected"
                                        label="Type" required :items="['Individual Account', 'Company Account']"></v-select>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field label="Amount" variant="outlined" :readonly="readonly" type="number"
                                        v-model="item.item.amount" step="0.00001"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field v-if="readonly" label="Payment Method" variant="outlined"
                                        :readonly="readonly" v-model="item.method"></v-text-field>

                                    <v-select v-else variant="outlined" :readonly="readonly" min="0" v-model="item.p_method"
                                        label="Payment Method" required :items="['Bank', 'Cheque', 'Cash']"></v-select>
                                </v-col>
                                <v-divider class="my-5"></v-divider>
                                <v-col cols="6" md="6">
                                    <v-text-field label="Account Name" variant="outlined" :readonly="readonly"
                                        v-model="item.acct_name"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-text-field variant="outlined" :readonly="readonly" min="0" type="number"
                                        v-model="item.acct_no" label="Account No" required></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-text-field label="Bank Name" variant="outlined" :readonly="readonly"
                                        v-model="item.bank"></v-text-field>
                                </v-col>
                            </v-row>

                        </v-form>

                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red-darken-1" @click="close('transfer')">
                            Close
                        </v-btn>
                        <v-btn color="blue-darken-1" v-if="!readonly" @click="saveTransfer">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <!-- DELETE DIALOG-->

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




    </v-container>
</template>


<script>
import { useConfigStore } from '~~/store/config'
import { useBranchStore } from '~~/store/branchStore'
import { useStockStore } from '~~/store/stocks'
import { useUsersStore } from '~~/store/users'
import { useProductStore } from '~~/store/productsStore'
import { useSalesStore } from '~~/store/sales'

import { formatDate } from '../../composables/getFilters'

export default {
    props: {
        'task': '',
        'items': {}
    },
    setup(props, { emit }) {
        const { $api } = useNuxtApp()
        const configStore = useConfigStore()
        const productStore = useProductStore()
        const stocksStore = useStockStore()
        const branchStore = useBranchStore()
        const usersStore = useUsersStore()
        const salesStore = useSalesStore()

        const dialog = ref(false)
        const transferDialog = ref(false)
        const i = props.items

        const item = ref({ ...i })
        // let item = reactive({
        //     title: '',
        //     desc: '',
        //     amount: null,
        //     p_method: '',
        //     acct_no: '',
        //     acct_name: null,
        //     bank: null,
        //     selected: null,
        //     type: null,
        // })
        const delete_item = ref('')
        const readonly = ref(true)
        const isIncome = ref(false)
        const isExpenses = ref(false)
        const dialogTitle = ref('')
        const deleteDialog = ref(false)
        const otherForm = ref(null)

        function deleteItem() {
            deleteDialog.value = true
            //delete_item.value = item
        }

        async function deleteConfirm() {

            let url = ''
            if (item.value.type.includes('income')) {
                url = '/api/incomes/deleteIncome'
            } else {
                url = '/api/expenses/deleteExpense'
            }

            await $api.post(url, { 'item': item.value }).then((res) => {

                configStore.alert_msg = 'Successfully deleted'
                deleteDialog.value = false
                emit('close', true)
            })
                .catch((err) => {
                    console.log(err.response)
                    //throw new Error('KKSKSKSK')
                    configStore.alert_msg = 'An error occured during deletion'
                })

        }

        function editItem(e) {
            console.log(e)
            readonly.value = false
            if (e.type.toLowerCase().includes('transfer')) {
                const r = JSON.parse(e.item.misc)
                item.value.acct_name = r.acct_name
                item.value.acct_no = r.acct_no
                item.value.bank = r.bank


                dialogTitle.value = e.type
                transferDialog.value = true
            } else {
                console.log('Other')
                dialogTitle.value = e.type
                dialog.value = true
            }

        }

        function viewItem(e) {

            if (e.type.toLowerCase().includes('transfer')) {
                const r = JSON.parse(e.item.misc)
                item.value.acct_name = r.acct_name
                item.value.acct_no = r.acct_no
                item.value.bank = r.bank
                dialogTitle.value = e.type
                transferDialog.value = true
            } else {

                dialogTitle.value = e.type
                dialog.value = true
            }

        }

        function saveEdit() {
            if (item.value.title && item.value.amount && item.value.p_method) {
                const a = item.value

                const type = a.type.includes('expenses') ? 1 : 2
                console.log(a)
                let url = ''
                if (type == 2) {
                    url = 'api/incomes/saveUpdate'
                } else {
                    url = 'api/expenses/saveUpdate'
                }

                $api.post(url, { 'data': a })
                    .then((res) => {
                        configStore.alert_msg = 'Successfully Saved'
                        console.log(res)
                        close('expenses')
                    })
                    .catch((err) => {
                        console.log(err.response)
                        configStore.alert_msg = 'An error Occurred'
                    })
            } else {
                configStore.alert_msg = 'Please fillup the form'
            }
        }

        function saveTransfer() {

            if (item.value.title && item.value.amount && item.value.acct_no && item.value.acct_name) {
                const a = item.value

                a.desc = `fund transfer to ${a.selected} - ${a.acct_name} (${a.acct_no})`
                a.type = 'fund transfer'
                a.misc = {
                    'acct_no': a.acct_no,
                    'acct_name': a.acct_name,
                    'bank': a.bank
                }
                // console.log(a)
                $api.post('api/expenses/saveUpdate', { 'data': a })
                    .then((res) => {
                        configStore.alert_msg = 'Successfully Saved'
                        console.log(res)
                        close('transfer')
                    })
                    .catch((err) => {
                        console.log(err.response)
                        configStore.alert_msg = 'An error Occurred, please fill up all items on the form'
                    })
            } else {
                configStore.alert_msg = 'Please fill up the fields'
            }

        }


        onMounted(() => {
            //console.log('Yessssssssssssssss')
            console.log(props)
            if (props.task == 'view') {
                // item = props.items
                viewItem(props.items)
            } else if (props.task == 'edit') {
                editItem(props.items)
            } else if ('delete') {
                deleteItem(props.items)
            }
        })


        function close() {
            transferDialog.value = false
            dialog.value = false
            emit('close', true)
        }
        return {
            saveEdit, viewItem, deleteItem, editItem, deleteConfirm, isExpenses, isIncome, readonly, item,
            transferDialog, dialog, dialogTitle, saveTransfer,
            deleteDialog, close, otherForm: null,

        }
    }
}

</script>