import { useConfigStore } from '~~/store/config';
import { useSalesStore } from '../store/sales'

const salesStore = useSalesStore();
const {$api} = useNuxtApp()
const config = useConfigStore()

const checkReg = () => {
    if(salesStore.ledger_id){
        $api.get('/api/registry/checkActive').then((res) => {
            const d = res.data.result[0]
            // console.log({"active_reg": d})
            if (d) {
                salesStore.openLedger(d.id, d.time_opened)
                //salesStore.ledger_alert = true
                
            } else {
               // salesStore.ledger_alert = true
            }
        })
            .catch((err) => {
                console.log(err.response.data)
                config.alert_msg = 'An error occurred '
            })

            return
    }

}

export default checkReg