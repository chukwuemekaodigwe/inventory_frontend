//import { VCardActions } from 'vuetify/lib/components'
import { User, useUsersStore } from './users'
import { Branch, useBranchStore } from './branchStore'
 import countryCurrencies from '../composables/currency'
// import { useSubscriptionStore } from './subscription'
// import { usePermissionStore } from './permissions'
// import { useNoticeStore } from './notifications'
// import { useSalesStore } from './sales'
// import { useStockStore } from './stocks'
// import { useProductStore } from './productsStore'
// import { useCustomerStore } from './customers'

export interface Company {
    id?: number,
    name?: string,
    address?: string,
    phone?: string,
    logo?: string,
    currency: 'USD',
    units?: JSON,
    created_at?: Date
}

export interface configState {
    company: Company,
    user: User,
    branch: Branch,
    loggedIn_at?: Date,
    auth_token?: string,
    alert_msg?: string,
    pageTitle: string,
    baseURL: string,
    keys: {
        sales: string,
        user?: number,
        company?: number,
        branch?: number
    },
    tablePager: {
        totalItems: number,
        perPage: number,
        pageUrl: string
        currentPage: number,
        httpMethod: string,
        startItem: number
    },
    delete_alert: string | boolean,

}

export const useConfigStore = defineStore('configStore', {

    state: (): configState => {
        return {
            company: {
                'address': 'No 1 Old Rd',
                'name': 'Aha free',
                'logo': '/',
                'currency': 'USD',
                'phone': '+780907277'
            },
            user: undefined,
            branch: {
                'address': 'No 1 Old Rd',
                'title': 'Aha free',

            },
            loggedIn_at: undefined,
            auth_token: undefined,
            alert_msg: undefined,
            baseURL: '//127.0.0.1:8000',
            pageTitle: 'vip',
            keys: {
                sales: '',
                user: undefined,
                company: undefined,
                branch: undefined
            },
            tablePager: {
                totalItems: 0,
                perPage: 30,
                pageUrl: '',
                currentPage: 1,
                httpMethod: 'get',
                startItem: 1
            },
            delete_alert: false
        }
    },

    getters: {

        getUser(state: configState) {
            return state.user
        },

        getToken(state: configState) {
            return state.auth_token
        },

        getConfig(state: configState) {
            return state
        },
        getCompany(state: configState) {
            return state.company
        }

    },

    actions: {
        registerNewLogin(User: any) {
            const { user, token, company, branch } = User
            this.user = user
            this.loggedIn_at = new Date()
            this.auth_token = token
            this.company = user.company
            this.branch = user.branch

            return true
        },

        updateCompany(company: Company) {
            this.company = company
        },

        setupKeys(user: User) {
            const keys = this.keys
            keys.user = user.id,
                keys.branch = user.branch_id,
                keys.company = user.company_id,
                keys.sales = `${user.company_id}${user.branch_id}${user.id}`
            this.keys = keys
            return keys
        },

        updatePaginator(options: any, httpMethod = '') {
            const pager = this.tablePager
            pager.currentPage = options.current_page
            pager.pageUrl = options.path
            pager.perPage = options.per_page
            pager.httpMethod = httpMethod
            pager.totalItems = options.total
            this.tablePager = pager
        },

        logout() {
            useConfigStore().$reset()
            useBranchStore().$reset()
            useUsersStore().$reset()
            usePermissionStore().$reset()
            useSubscriptionStore().$reset()
            useNoticeStore().$reset()
            useSalesStore().$reset()
            useStockStore().$reset()
            useProductStore().$reset()
            useCustomerStore().$reset()
        },
        releasePaginator() {
            const pager = this.tablePager
            pager.currentPage = 1
            pager.pageUrl = ''
            pager.perPage = 0
            pager.httpMethod = 'get'
            pager.totalItems = 1

            this.tablePager = pager
        },

        getCurrency() {
            const str = this.company.currency
            const currencies = countryCurrencies
            return currencies.find((el) => el.code == str)
        },



        currencyFormatter() {

            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: this.company.currency

                // These options are needed to round to whole numbers if that's what you want.
                //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
            })

        },
    },
    persist: {
        storage: persistedState.localStorage,
    }


})
