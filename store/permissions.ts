import { useConfigStore } from "./config";

export interface PermissionState {
    permissions?: [], // all permissions
    userpermissions: [],
    title?: number
}

export const usePermissionStore = defineStore('capabilityStore', {

    state: (): PermissionState => ({
        permissions: [],
        userpermissions: [],
        title: undefined
    }),

    getters: {
        getUserPermissions(state: PermissionState) {
            return state.userpermissions
        },
        getRole: (state: PermissionState) => {
            return state.title
        },

    },

    actions: {
        hasPermission(ability: [string]) {  //check if a user has a capability/permission
            if (!ability.length) return true; if (this.title == 1) return true
            if (this.permissions?.length) {
                const a = ability.filter(el => {
                    return this.userpermissions.includes(el)
                })

                return a.length ? true : false
            } 
            return false
        }
    },
    persist: {
        storage: persistedState.localStorage,
    }

})