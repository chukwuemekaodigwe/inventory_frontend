export interface Customer {
    id?: number
    name?: string,
    address?: string,
    phone?: string,
    company_id?: number
    branch_id?: number
}

export interface customerState {
    customers: Customer[],
    company?: number
}

export const useCustomerStore = defineStore('customerStore', {

    state: (): customerState => ({
        customers: [],
        company: undefined
    }),

    getters: {
        getCustomers(state: customerState) {
            return state.customers
        },
        getCustomerById: (state: customerState) =>  {
            return (id: number) => state.customers.find((el) => el.id === id);
        },
        countCustomers(state: customerState) {
            return state.customers.length
        },
    },

    actions: {
        addNewCustomer(customer: Customer) {
            this.customers.push(customer)
        },

        removeCustomer(customer: Customer) {
            const i = this.customers.findIndex((el) => el.id = customer.id)
            return this.customers.splice(i, 1)
        },

        loadCustomers(customers: Customer[]) {
            this.customers = customers
        },

        updateCustomer(user: Customer) {
            const i = this.customers.findIndex((el) => el.id === user.id)
            return this.customers.splice(i, 1, user)
        }
    },
    persist: {
        storage: persistedState.localStorage,
    }

})