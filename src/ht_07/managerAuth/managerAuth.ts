import {add} from "date-fns";
import {userRegistrationModel} from "../db";
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
    async createUser(login:string, email:string,passwordAccess:string,passwordRefresh:string,
                     hash:string,salt:string, userId:string,conformationCode:string ,isConfirmed?:boolean) : Promise<RegistrationTokenType>{

        return {
            accountData:{
                userId:userId,
                login:login,
                email:email,
                createAt:new Date(),
                passwordAccess:passwordAccess,
                passwordRefresh:passwordRefresh,
                hash:hash,
                salt:salt,
            },
            emailConformation:{
                conformationCode: conformationCode ,
                expirationDate: add(new Date(),{minutes:5}),
                isConfirmed:isConfirmed? isConfirmed:false
            }
        }
    },
    async updateUser(email:string,conformationCode:string){
        return userRegistrationModel.updateOne(
            {"accountData.email": email},
            { $set:
                    {
                        "emailConformation.conformationCode":conformationCode,
                        "emailConformation.isConfirmed":false,
                        "emailConformation.expirationDate":add(new Date(),{minutes:5})
                    }
            })}
}