export interface Notice {
    'title': string,
    'message': string,
    'meant_for': number | Array<number> | Array<string>,
    'url': string

}

export interface NoticeState {
    'notices': Notice[],

}


export const useNoticeStore = defineStore('noticeStore', {
    state: (): NoticeState => ({
        notices: [],


    }),

    getters: {
        countNotice(state: NoticeState) {
            return state.notices.length
        },

    },

    actions: {
        addNotice(notice: Notice[]) {
          //  if (notice.length) {
                this.notices = notice
          //  }
        },

        addTransferNotice(count : number){

            const newNotice = {
                'title': 'Stock Transfer Alert',
                'message': 'You have awaiting stock transferred to your branch, please acknowledge',
                'meant_for': [],
                'url': '/stockReport#pending'
            }

            this.notices  = [newNotice]
        }

    },
    persist: {
        storage: persistedState.localStorage,
    }
})

