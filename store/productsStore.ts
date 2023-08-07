export interface Product {
    id: number,
    name: string,
    image: Blob | string,
    sku: string,
    alert_level: number,
    type: string | number,
    costprice: number,
    sellingprice: number
    company_id: number,
    units: string,
    stock?: number

}

export interface productState {
    products: Product[],
    loaded: boolean,
    time?: string,
    searchProduct: Product[]
}

export const useProductStore = defineStore('productStore', {
    state: (): productState => ({
        products: [],
        loaded: false,
        time: undefined,
        searchProduct: []
    }),

    getters: {
        productCount(state: productState) {
            return state.products.length
        },
        getProductById: (state: productState) => {
            return (id: number) => state.products.find(product => product.id === id)
        },

        getTemporary: (state: productState) => {
            //return state.products.filter(element => element.deleted_at == undefined)
            return state.searchProduct;
        },

        getProducts: (state: productState) => {
            //return state.products.filter(element => element.deleted_at == undefined)
            return state.products;
        },
        countProduct(state: productState) {
            return state.products.length
        },
    },

    actions: {
       async loadProducts(products: Product[]) {
            const item:Product[] = []
           await products.forEach((el) => {
                if(el){
                const a: Product = {
                    id: el.id,
                    name: el.name,
                    image: el.image,
                    sku: el.sku,
                    alert_level: el.alert_level,
                    type: el.type,
                    costprice: el.costprice,
                    sellingprice: el.sellingprice,
                    company_id: el.company_id,
                    units: el.units,
                }
                item.push(a)
            }
            })

            this.products = item
            this.loaded = true
            this.time = new Date().toLocaleDateString('en-gb')
        },

        addProduct(product: any) {
            let new_product: Product = product
            // new_product.inStockQty = product.stock.quantity
            this.products.push(new_product)
            return true
        },
        updateProduct(product: Product) {
            const found = this.products.findIndex((el) => el.id === product.id)
            if (found === -1) return false
            this.products.splice(found, 1, product);
        },

        removeProduct(product: Product) {
            const found = this.products.findIndex((el) => el.id === product.id)
            if (found === -1) return false
            return this.products.splice(found, 1);

        },

        updatePrice(product){
            
            const res = this.products.map((el)=>{
if(el){
                const a = product.find(el2=>el2.product_id == el.id)

                if(a){
                    el.costprice = a?.costprice
                    el.sellingprice = a?.sellingprice
                    return el
                }
            }
            })
            this.products = res
            
        },


        searchProduct(term: string | number): Product[] {
            const search = term?.toString().toLowerCase()
            const result = this.products.filter((el) => {
                const a = Object.values(el);
                const r = a.filter((el) => el?.toString().toLowerCase().includes(search))
                if (r.length) {
                    return el
                }
            })
            return result;
        },
    },
    persist: {
        storage: persistedState.localStorage,

    }
})

