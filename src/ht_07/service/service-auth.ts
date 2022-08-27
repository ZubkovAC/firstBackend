import {injectable} from "inversify";
import {createJWT} from "../helpers/helpers";
import {add} from "date-fns";
import * as nodemailer from "nodemailer";
const bcrypt = require('bcrypt')

@injectable()
export class AuthService{
    async createToken(userId:string,login:string,email:string,date:string){
        return  await createJWT({userId, login,email},date)
    }
    async createUser(login:string, email:string,password:string,passwordAccess:string,
                     passwordRefresh:string, userId:string,conformationCode:string ,isConfirmed?:boolean){
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hashSync( password,salt)
        return {
            accountData:{
                userId:userId,
                login:login,
                email:email,
                createAt:new Date(),
                passwordAccess:passwordAccess,
                passwordRefresh:passwordRefresh,
                hash:passwordHash,
                salt:salt,
            },
            emailConformation:{
                conformationCode: conformationCode ,
                expirationDate: add(new Date(),{minutes:5}),
                isConfirmed:isConfirmed? isConfirmed:false
            }
        }
    }
    async sendEmail(emailTo:string,conformationCode:string) {
        const transporter = await nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }

        })
        transporter.sendMail ({
            from: `3y6kob <${process.env.EMAIL}>`, // sender address
                to: emailTo, // list of receivers
            subject: "Registration ✔", // Subject line
            text: `https://some-front.com/confirm-registration?code=${conformationCode}`, // plain text body
            // html: "https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=youtcodehere", // html body

        })
        return
    }
}