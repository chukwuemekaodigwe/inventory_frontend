<template>
    <v-card class="mx-auto">
        <v-img :src="profile" height="200px" cover>
            <v-card-title class="d-flex justify-space-between text-white">
                {{ product.name }}
                <div class="d-flex flex-column">
                    <v-btn icon color="error" size="x-small" @click.stop="close()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-btn icon color="info" size="x-small" @click.stop="{ is_edit = true; product.update = true }">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </div>
            </v-card-title>

        </v-img>

        <v-form ref="productForm" enctype="multipart/form-data">
            <v-text-field v-model="product.name" label="Product Name" hide-details :readonly="!is_edit"></v-text-field>
            <v-text-field v-model="product.sku" label="Product Sku" :readonly="!is_edit"></v-text-field>

            <v-autocomplete
                v-model="product.product_type" label="Select product type" :items="productTypes"
                :readonly="!is_edit"></v-autocomplete>

            <v-autocomplete v-model="product.unit"
                label="Select product measuring units or create a new one" :items="units" :readonly="!is_edit"></v-autocomplete>

            <v-text-field type="number" label="Quantity In Stock"
                :model-value="!is_edit ? stockStock.getStockQty(product.id) : 0" v-if="!is_edit"
                :readonly="!is_edit"></v-text-field>

            <v-text-field type="number" v-model="product.alert_level" label="Out-of-stock alert level"
                :readonly="!is_edit"></v-text-field>

            <div class="ma-5" v-if="is_edit">
                <CloudinaryUploadButton @error="(useConfigStore().alert_msg='An error occurred, please retry')" 
                @success="processImage"  :presetDefinintion="process.public.PRODUCT_PUBLIC_ID" :label="'Product Image'"/>            </div>

            <v-switch class="mx-6 my-0" v-model="product.updatePrice" color="primary" label="Change Product Price?"
                v-if="!is_edit" />
            <div class="d-flex flex-row m-0">

                <v-text-field type="number" v-model="product.costprice" label="Cost Price"
                    :readonly="(!is_edit && !product.updatePrice)"></v-text-field>
                <v-text-field type="number" v-model="product.sellingprice" label="Selling Price"
                    :readonly="(!is_edit && !product.updatePrice)"></v-text-field>

            </div>

            <div class="mx-10 my-0 text-center">
                <v-switch v-model="product.addStock" color="primary" label="Add New Stock?" value="true" />

            </div>
            <v-text-field v-model="product.new_quantity" label="New Quantity" type="number" step="0.0001"
                v-if="product.addStock">
            </v-text-field>

            <div class="d-flex flex-row justify-center my-5">
                <v-btn color="error" prepend-icon="mdi-reply" size="small" @click.stop="close()">Back</v-btn>
                <v-btn color="primary" prepend-icon="mdi-vuetify" size="small" @click="save">
                    Save
                </v-btn>
            </div>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">
import { useConfigStore, configState } from '~~/store/config';
import { useProductStore, Product } from '~~/store/productsStore';
import { useStockStore, Stock } from '~~/store/stocks';

const { $api } = useNuxtApp();
const productStore = useProductStore();
const configStore = useConfigStore()
const stockStock = useStockStore()


const process = useRuntimeConfig()

const props = defineProps({
    add: {
        type: Boolean,
        default: false
    },
    activeproduct: {
        type: Object, default: {}
    },

})

const emit = defineEmits(['close'])
const form = ref('')
//console.log(configStore.$state)
const new_quantity = ref('')
const is_edit = ref(false)
const changePrice = ref(false)
const add_quantity = ref(false)
const profile = ref('https://cdn.vuetifyjs.com/images/cards/sunshine.jpg')
const productForm = ref(null)
const owning = ref('')

const prod = {
    id: '',
    name: '',
    sellingprice: '',
    costprice: '',
    new_quantity: new_quantity.value,
    sku: '',
    unit: '',
    alert_level: '',
    image: '',
    product_type: '',
    updatePrice: false,
    update: false,
    addStock: false,
    inStockQty: ''

}

let product = ref(prod)

if (props.add) {
    is_edit.value = true
    product.value.image = profile.value

} else {
    Object.assign(product.value, props.activeproduct)
    profile.value = product.value.image
}

const productTypes = [
    'Measurable Products', 'Countable Products'
]

const units = unitList

function showImage(ev) {
    const image = ev.target

    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output');
        profile.value = reader.result;
    };
    reader.readAsDataURL(ev.target.files[0]);

    product.value.image = ev.target.files[0]
}


function save() {
    if ((product.value.name) && (product.value.sellingprice) && (product.value.costprice)) {
        //console.log(product);
        if (!props.add) {
            

            $api.postForm('api/products/saveUpdate', product.value, {
                headers: {
                    "Content-Type": 'multipart/form-data',
                    'Authorization': `Bearer ${configStore.auth_token}`
                }
            }).then((res) => {
                


                //res.data.product.inStockQty = res.data.stock.quantity
                productStore.updateProduct(res.data.product)
                close()
                return configStore.alert_msg = 'Product Updated Successfully'
            }).catch((err) => {
                configStore.alert_msg = 'An error occurred'
                return
            }
            )
        } else {
            $api.postForm('api/products/saveProduct', product.value,
                {
                    headers: {
                        "Content-Type": 'multipart/form-data',
                        'Authorization': `Bearer ${configStore.auth_token}`
                    }
                }).then((res) => {
                    const newProduct: Product = res.data.product

                    if (productStore.addProduct(newProduct)) {
                        configStore.alert_msg = 'Product Added Successfully'
                       
                        product.value.update = false
                        product.value.updatePrice = false
                        product.value.addStock = false
                        emit('close', true)
                    } else {
                        
                        configStore.alert_msg = 'An error Occurred'
                    }
                })
                .catch((err)=>{
                    console.log(err)
                    configStore.alert_msg =  'An error occured'
                })

        }
    } else {
        configStore.alert_msg = 'Please fill up the form'
    };


}

function close() {
    //  Object.assign(product.value, nnn)
    //productForm.value.reset()
    
    product.value.update = false
    product.value.updatePrice = false
    product.value.addStock = false
    emit('close', true)
}

onBeforeUnmount(() => {
    close()
})
</script>

<style>
/* .v-text-field {
    margin-bottom: 0;
} */
</style>