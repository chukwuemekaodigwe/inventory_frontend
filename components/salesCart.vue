<template>
    <v-card class="overflow-hidden" color="purple lighten-1" dark>
        <v-toolbar flat color="purple">
            <v-icon>mdi-account</v-icon>
            <v-toolbar-title class="font-weight-light">
                User Profile
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="purple darken-3" fab small @click="isEditing = !isEditing">
                <v-icon v-if="isEditing">
                    mdi-close
                </v-icon>
                <v-icon v-else>
                    mdi-pencil
                </v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-text-field :disabled="!isEditing" color="black" label="Name"></v-text-field>
            <v-autocomplete :disabled="!isEditing" :items="states" :filter="customFilter" color="black" item-text="name"
                label="State">
            </v-autocomplete>
        </v-card-text>

        <v-list dense color="transparent">
            <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item v-for="item in states" :key="item.name">

                    <v-list-item-avatar>
                        <v-img :src="item.name"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-text-field color="black" :label="`Quantity of ${item.name}`"></v-text-field>
                    </v-list-item-content>
                    <v-list-item-icon>
                        <v-icon color="black">
                            mdi-close
                        </v-icon>
                    </v-list-item-icon>

                </v-list-item>
            </v-list-item-group>
        </v-list>

        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!isEditing" color="success" @click="save">
                Save
            </v-btn>
        </v-card-actions>
        <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
            Your profile has been updated
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