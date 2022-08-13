import {add} from "date-fns";
import {registrationToken06} from "../db";
import {RegistrationTokenType} from "../types";

export const ManagerAuth05={
    mesRegistration(code:string){
        const registration = `https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=${code}`
        return`<h1>confirmation email</h1> <div><a href=${registration}>click</a></div>`
    },
    mesRecovery(){
        return '' // message <div>
    },

}

export const manager = {
    async createUser(id:string,login:string,email:string,token:string,conformationCode:string) : Promise<RegistrationTokenType>{
        return {
            accountData:{
                id:id,
                login:login,
                email:email,
                createAt:new Date(),
                passwordHash:token
            },
            emailConformation:{
                conformationCode: conformationCode ,
                expirationDate: add(new Date(),{minutes:5}),
                isConfirmed:false
            }
        }
    },
    async updateUser(email:string,conformationCode:string){
        return registrationToken06.updateOne(
            {"accountData.email": email},
            { $set:
                    {
                        "emailConformation.conformationCode":conformationCode,
                        "emailConformation.isConfirmed":false,
                        "emailConformation.expirationDate":add(new Date(),{minutes:5})
                    }
            })}
}