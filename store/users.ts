import { defineStore } from "pinia"
import { Company } from "./config"

export interface User {
    id: number,
    name: string,
    phone: string,
    email: string,
    company_id: number,
    branch_id: number
}

export interface UserState {
    users: User[],
    company?: number,

}

export const useUsersStore = defineStore('userStore', {
    state: () : UserState => {
        return {
            users: [],
            company: undefined
        }
    },

    getters: {
        getUsers(state): User[] {
            return state.users
        },
        countUsers(state: UserState) {
            return state.users.length
        },
        getUserById: (state: UserState) =>  {
            return (id: number) => state.users.find(product => product.id == id)
        },

    },

    actions: {
        addNewUser(branch: User){
            this.users.push(branch)
        },

        removeUser (branch: User){
            const i = this.users.findIndex((el) => el.id = branch.id)
            return this.users.splice(i, 1)
        },

        loadUsers (users: User[]) {
            this.users = users
        },

        updateUser(user: User) {
            const i = this.users.findIndex((el) => el.id === user.id)
            return this.users.splice(1, 1, user)
        }

    },
    persist: {
        storage: persistedState.localStorage,
    }
})

