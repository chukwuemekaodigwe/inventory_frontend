
import { Product } from "./productsStore"
import { useConfigStore } from "./config"
import { useStockStore } from "./stocks"

export interface Sale {
    id: number,
    product_id: number,
    qty: number,
    unit: string,
    price: number,
    order_id?: string,
    cost_price: number,
    inStockQty: number,
    total?: number
}


export interface Order {
    order_id: string,
    invoice_no: any,
    status: string,
    user_id: number,
    total: number,
    amount_paid: number,
    remainder: number,
    discount: number,
    payment_method: {

    },
    id?: number,
    customer: {
        name: string,
        phone: string,
        id?: number,
        company_id?: number,
        address: string
    }
    company_id: number,
    branch_id: number,
    sales: Sale[]
    created_at?: Date,
    total_payable: number,
}


export interface salesState {
    sales: Order[],
    cart: Sale[],
    cart_out: boolean,
    check_out: boolean,
    drafts: Order[],
    date?: Date,
    salesAgent?: number,
    ledger_id?: number,
    ledger_alert?: boolean | number,
    is_draft: boolean | string,
    invoice_type: string
}


export const useSalesStore = defineStore('salesStore', {
    state: (): salesState => ({
        sales: [],
        cart: [],
        drafts: [],
        cart_out: false,
        check_out: false,
        date: undefined,
        salesAgent: undefined,
        ledger_id: undefined,
        ledger_alert: false,
        is_draft: false,
        invoice_type: ''
    }),


    getters: {
        countSales(state: salesState) {
            return state.sales.length
        },
        getDraftById: (state: salesState) => {
            return (id: number) => state.drafts.find(stock => stock.id === id)
        },
        getDrafts(state: salesState) {
            return state.drafts
        },

        showCart(state: salesState) {
            return state.cart
        },

        getSales(state: salesState) {
            return state.sales
        },

        getCartTotal(state: salesState) {
            const total = state.cart.reduce((a, b) => {
                a.price += b.price
                return a
            })

            //  console.log(total)
            return total.qty
        }


    },


    actions: {
        saveSale(stocks: Order) {
            let a = this.sales.push(stocks);
            console.log(stocks)
            useStockStore().enterNewSale(stocks.sales)

        },

        openLedger(id: number, date: Date) {
            this.ledger_id = id
            this.date = date
        },

        addToCart(sale: Product) {

            if (!this.ledger_id) {
                return this.ledger_alert = true
            }

            const i = this.cart.findIndex((el) => el.id === sale.id)
            if (sale.stock <= 0) {
                return useConfigStore().alert_msg = `${sale.name} is out of Stock!`
            }
            if (i === -1) {
                const newSale = {
                    id: sale.id,
                    product_id: sale.id,
                    qty: '',
                    unit: sale.units,
                    price: sale.sellingprice,
                    cost_price: sale.costprice,
                    name: sale.name,
                    total: 0,
                    inStockQty: useStockStore().getStockQty(sale.id),
                    order_id: undefined,

                }

                return this.cart.push(newSale)
            }
        },
        clearCart() {
            this.cart = []
            this.check_out = false
            this.is_draft = false
        },
        removeFromCart(sale: Sale) {
            const i = this.cart.findIndex((el) => el.id === sale.id)
            return this.cart.splice(i, 1)
        },

        checkOut() {
            const cart = this.cart
            const check = cart.filter((el) => {
                if ((el.qty > el.inStockQty) || (!el.qty)) return true

            })

            if (check.length) {
                return useConfigStore().alert_msg =
                    'Pleas provide the appropiate product quantity'
            } else {
                this.check_out = true

            }
        },

        async saveDraft(order: Order) {
            await this.drafts.push(order)
            return true
        },

        deleteDraft(order: string) {
            const i = this.drafts.findIndex((el) => el.order_id === order)
            this.is_draft = false
            return this.drafts.splice(i, 1)
        },

        showDraft(order: Order) {
            this.cart = order.sales
            this.is_draft = order.order_id
            return true
        }
    },

    persist: {
        storage: persistedState.localStorage,
    }

})
