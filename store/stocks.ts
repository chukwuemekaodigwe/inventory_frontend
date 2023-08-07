import { useConfigStore } from "./config"
import { Sale } from "./sales"

export interface Stock {
    product_id: number,
    branch_id: number,
    stockQty: number,
    salesQty: number,
    company_id: number,
    qty?: number
}

export interface stockState {
    stocks: Stock[],

}

export const useStockStore = defineStore('stocksStore', {

    state: (): stockState => ({
        stocks: [],
    }),

    getters: {
        getStockQty: (state: stockState) => {
            return (id: number) => {
                const i = state.stocks.findIndex(stock => stock.product_id == id)
                if (i == -1) return 0
                const a = state.stocks.find((e) => e.product_id == id)
                //console.log(a)
                if (!a?.salesQty) return a?.stockQty
                const b = a.stockQty - a.salesQty
                if (b < 0) return 0
                return b
            }
        },

        getSalesQty: (state:stockState) => {
            return (id: number) => {
                const i = state.stocks.find(el => el.product_id === id)
                return i?.salesQty ? i.salesQty : 0
            }
        }

    },

    actions: {
        loadStocks(stocks: Stock[], sales: Stock[]) {
            const res = []
            stocks.forEach((el, i) => {
                const a: Stock = {
                    'product_id': el.product_id,
                    'branch_id': useConfigStore().branch.id,
                    'company_id': useConfigStore().company.id,
                    'stockQty': el.qty,
                    'salesQty': sales.find((a) => a.product_id == el.product_id)?.qty
                }

                res.push(a)
            })
            this.stocks = res

        },

        enterNewStock(stocks: Sale[]) {
            stocks.forEach((stock) => {
                const res = this.stocks.findIndex((el) => el.product_id == stock.product_id)
                if (res == -1) return

                const a = this.stocks.find((el) => el.product_id == stock.product_id)
                if (a?.stockQty) {
                    const b = parseInt(a?.stockQty) + parseInt(stock.qty)
                    a.salesQty = b
                    this.stocks.splice(res, 1, a)
                }

            })
        },

        enterNewSale(stocks: Sale[]) {
            stocks.forEach((stock) => {
                const res = this.stocks.findIndex((el) => el.product_id == stock.product_id)
                if (res == -1) return
                const a = this.stocks.find((el) => el.product_id == stock.product_id)
                if (a?.salesQty) {
                    const b = parseInt(a?.salesQty) + parseInt(stock.qty)
                    a.salesQty = b
                    this.stocks.splice(res, 1, a)
                }

            })
        },


        updateStock(stock: Stock) {
            const found = this.stocks.findIndex((el) => el.product_id === stock.product_id)
            if (found === -1) return false
            this.stocks.splice(found, 1, stock);
        },
        removeStock(stock: Stock) {
            const res = this.stocks.find((el) => el.product_id == stock.product_id)
            if (res) {
                res.stockQty = res.stockQty - stock.qty

            }
        },

        removeSale(stock: Stock) {
            const res = this.stocks.find((el) => el.product_id == stock.product_id)
            if (res) {
                res.salesQty = res.salesQty + stock.qty

            }
        },
    },

    persist: {
        storage: persistedState.localStorage,
    }


})
