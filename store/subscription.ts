export interface Plan {
    id: number,
    title : string,
    amount: number,
    users : number,
    branches: number,
    auditor: number,
    exportable: boolean,
    status: number,
    transactions: number
  }

  
export interface Subscription {
    id?: number
    plan_id?: string,
    payment_status?: string,
    start_date?: Date,
    end_date: Date,
    company_id?: number
    durationInMonth?: number
}

export interface subscriptionState {
    plans: Plan[],
    subscription?: Subscription,
    company?: number
}

export const useSubscriptionStore = defineStore('subStore', {
    state: (): subscriptionState => ({
        plans: [],
        subscription: undefined,
        company: undefined
    }),

    getters: {
        getPlans(state: subscriptionState) {
            return state.plans
        },
        getPlanById: (state: subscriptionState) =>  {
            return (id: number) => state.plans.find((el) => el.id === id);
        },
        getCompanySubscription(state: subscriptionState) {
            return state.subscription
        },
    },

    actions: {

        loadSubscription(item: Subscription) {
           this.subscription = item
        },

        loadPlans(plans: Plan[]) {
            this.plans = plans
        },
    },
    persist: {
        storage: persistedState.localStorage,
    }

})