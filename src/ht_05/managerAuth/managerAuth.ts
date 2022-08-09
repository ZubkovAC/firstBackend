export const ManagerAuth05={
    mesRegistration(code:string){
        // return "<h1>Hey man</h1><div><a href=`https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=${code}`>click me</a></div>" // message <div>
        // return `<a href='https://ferst-back.herokuapp.com/ht_05/api/auth/registration-confirmation?code=${code}'>click me</a>`// message <div>
        return `https://ferst-back.herokuapp.com/ht_05/api/auth/registration-confirmation?code=${code}`// message <div>
        // return "https://ferst-back.herokuapp.com/ht_05/api/auth/registration-confirm?code=youtcodehere" // message <div>
    },
    mesRecovery(){
        return '' // message <div>
    },

}