<template>
    <v-dialog v-model="dialog" max-width="500px">

        <v-card>
            <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete v-model="editedItem.product" :items="products" item-title="name" item-value="id"
                                label="Select Product" persistent-hint return-object single-line></v-autocomplete>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="editedItem.no_items" label="Stock Quantity"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-autocomplete v-model="editedItem.branch" :items="branches" item-title="name" item-value="id"
                                label="Select Branch" persistent-hint return-object single-line></v-autocomplete>
                        </v-col>

                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                    Cancel
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="400px">
        <v-card prepend-icon="mdi-delete" title="Are you sure you want to delete this item?">
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="outlined" @click="closeDelete">Cancel</v-btn>
                <v-btn color="red-darken-1" variant="outlined" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        desserts: {
            default: []
        }
    },
    data() {
        return {
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            editedItem: {  /* For editing the stock timeline table items  */
                product: { name: '', id: '' },
                no_items: 0,
                branch: { name: '', id: '' },
                stock_id: 0,
            },
            defaultItem: {  // Add stock modal
                product: { name: '', id: '' },
                no_items: 0,

                branch: { name: '', id: '' },
                stock_id: 0,

            },

            transferItem: {  //  stock transfer modal
                item: {
                    product: '',
                    no_items: 0,
                    unit: '',
                    product_id: 0
                },
                items: [],
                from_branch: 0,
                to_branch: 0,

            },
        }
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    methods: {

        editItem(item) {
            this.editedIndex = this.props.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.desserts.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem)
            } else {
                this.desserts.push(this.editedItem)
            }
            this.close()
        },

    }
}

</script>