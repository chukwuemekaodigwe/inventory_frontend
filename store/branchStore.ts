import { NuxtPluginIndicator } from 'nuxt/app'
import $api from '../plugins/api'

export interface Branch {
    id?: number
    title?: string,
    address?: string,
    admin?: number,
    company_id?: number
    status?: number
}

export interface branchState {
    branches: Branch[],
    company?: number,
    colorScheme: Object,
    thememode: string
}

export const useBranchStore = defineStore('branchesStore', {

    state: (): branchState => ({
        branches: [],
        company: undefined,
        colorScheme: {
            'pri': '',
            'pri2': '',
            'sec': '',
            'sec2': '',
            'text1': '',
            'text2': ''
        },
        thememode: 'light'
    }),

    getters: {
        getBranches(state: branchState) {
            return state.branches
        },
        getBranchById: (state: branchState) => {
            return (id: number) => state.branches.find((el) => el.id === id);
        },
        countBranches(state: branchState) {
            return state.branches.length
        },

        getTheme(state: branchState){
            return {'mode': state.thememode, 'colors': state.colorScheme}
        }
    },

    actions: {
        addNewBranch(branch: Branch) {
            this.branches.push(branch)
        },

        removeBranch(branch: Branch) {
            const i = this.branches.findIndex((el) => el.id = branch.id)
        },

        loadBranches(branches: Branch[]) {
            this.branches = branches
           // console.log({ 'store Branches': this.branches })
        },

        updateBranch(user: Branch) {
            const i = this.branches.findIndex((el) => el.id === user.id)
            return this.branches.splice(1, 1, user)
        },

        savetheme(items){
            const {theme, color } = items
            this.thememode = theme
            this.colorScheme = color
        }
    },
    persist: {
        storage: persistedState.localStorage,
    }

})