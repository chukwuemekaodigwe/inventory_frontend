import { useConfigStore } from '../store/config'

export function getYears(start_date: number) {
    let result = []
    const presentYear = new Date().getFullYear()

    for (let index = start_date - 1; index <= presentYear; index++) {
        result.unshift(index)

    }
    return result
}

function startOfWeek()
  {
    let date = new Date()
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  
    return new Date(date.setDate(diff));
 
  }

export function getDaysWithDates() {
    let result = [];
    let st = new Date()
    let start_date = startOfWeek()
    let dates = new Date(start_date).getTime()
    //return dates
    for (let index = 0; index < 7; index++) {
        let day = {
            name: new Date(dates).toLocaleDateString('en-gb', {weekday: "long"}),
            date: new Date(dates)
            
        }
        result.push(day)
        //console.log(dates)
        dates = dates + (60*60*24*1000)
       // console.log(dates)
    }

    return result
}

export function formatDate(date: Date) {
    date = new Date(date)
    var getYear = date.toLocaleString("default", { year: "numeric" });
    var getMonth = date.toLocaleString("default", { month: "2-digit" });
    var getDay = date.toLocaleString("default", { day: "2-digit" });

    var dateFormat = getYear + "-" + getMonth + "-" + getDay;

    return dateFormat
}

export function getMonthsWithNumeric(){
    let result = []
    for (let index = 0; index < 12; index++) {
        const date = new Date();
        date.setMonth(index);
      
        let month_name = date.toLocaleString('en-US', {
          month: 'long',
        });

        let month = {
            name: month_name,
            value: index
        }

        result.push(month)
        
    }

    return result
}

export const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function formatNumber(num:number, n = true){
    let formatter = Intl.NumberFormat('en', 
    { notation: !n ?  'compact' : 'standard' ,
    maximumSignificantDigits: 20,
    maximumFractionDigits: 2,

});

    return formatter.format(num)
}