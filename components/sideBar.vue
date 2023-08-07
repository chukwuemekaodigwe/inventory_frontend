<template>
    <v-card class="overflow-hidden" color="purple lighten-1" dark>
        <v-img :src="img">

        </v-img>
        <v-card-text>
            <v-text-field :disabled="!isEditing" v-model="name" label="Product Name"></v-text-field>


            <v-text-field :disabled="!isEditing" v-model="sku" label="Product SKU"></v-text-field>

            <v-text-field :disabled="!isEditing" v-model="cost_price" label="Cost Price"></v-text-field>

            <v-text-field :disabled="!isEditing" v-model="curr_price" label="Selling Price"></v-text-field>

            <v-text-field :disabled="!isEditing" v-model="alert_level" label=" Alert Level"></v-text-field>
            <v-text-field :disabled="!isEditing" v-model="stock_qty" label="Stock Quantity"></v-text-field>
            <v-checkbox v-model="newStock" :rules="[v => !v || 'You need to check this to add new stock!']"
                label="Do you want to add new stock ?"></v-checkbox>

            <v-text-field cols-10 :hidden="!newStock" v-model="newstock_qty" label="New Stock"></v-text-field>

            <v-autocomplete cols-2 :disabled="!newStock" :items="states" :filter="customFilter" item-text="name" label="Unit">
            </v-autocomplete>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!isEditing" color="success" @click="save">
                Save
            </v-btn>
        </v-card-actions>
        <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
            Has been updated
        </v-snackbar>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            hasSaved: false,
            isEditing: null,
            model: null,
            states: [
                { name: 'Florida', abbr: 'FL', id: 1 },
                { name: 'Georgia', abbr: 'GA', id: 2 },
                { name: 'Nebraska', abbr: 'NE', id: 3 },
                { name: 'California', abbr: 'CA', id: 4 },
                { name: 'New York', abbr: 'NY', id: 5 },
            ],
        }
    },

    methods: {
        customFilter(item, queryText, itemText) {
            const textOne = item.name.toLowerCase()
            const textTwo = item.abbr.toLowerCase()
            const searchText = queryText.toLowerCase()

            return textOne.indexOf(searchText) > -1 ||
                textTwo.indexOf(searchText) > -1
        },
        save() {
            this.isEditing = !this.isEditing
            this.hasSaved = true
        },
    },
}
</script>