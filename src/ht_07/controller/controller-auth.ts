import {backListTokenModel, userRegistrationModel} from "../db";
import {v4 as uuidv4} from "uuid";
import {createJWT} from "../helpers/helpers";
import {RegistrationTokenType} from "../types";
import {manager} from "../managerAuth/managerAuth";
import {EmailAdapter05} from "../adapter/emailAdapter";
import * as nodemailer from "nodemailer";
import {inject, injectable} from "inversify";
import {AuthService} from "../service/service-auth";
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

export const dateExpired={
    "0":"0sec",
    '1':'1sec',
    '10sec':'10sec',
    '15sec':'15sec',
    '20sec':'20sec',
    '1h':'1h',
    '2h':'2h'
}

@injectable()
export class AuthController {
    constructor(@inject(AuthService) protected authService:AuthService) {
    }
    async registrationConfirmation(req, res){
        const code = req.body.code
        await userRegistrationModel.updateOne({"emailConformation.conformationCode":code},{ $set:{"emailConformation.isConfirmed":true}})
        const infoCode = await userRegistrationModel.findOne({"emailConformation.conformationCode":code})
        res.send(204)
        return
    }
    async registration(req, res){
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const email = req.body.email.trim()
        const userId = uuidv4()
        const conformationCode = uuidv4()
        const passwordAccess = await this.authService.createToken(userId,login,email,dateExpired["1h"])
        const passwordRefresh = await this.authService.createToken(userId,login,email,dateExpired["2h"])
        const user :RegistrationTokenType = await this.authService.createUser(login,email,password,passwordAccess,passwordRefresh,userId,conformationCode)
        await userRegistrationModel.insertMany([user])
        const emails = await this.authService.sendEmail(email,conformationCode)
        res.send(204)
        return
    }
    async registrationEmailResending(req, res){
        const email = req.body.email
        const conformationCode = uuidv4()
        const newEmail = await  manager.updateUser(email,conformationCode)
        const emails = await this.authService.sendEmail(email,conformationCode)
        res.send(204)
        return
    }
    async login(req, res){
        const login = req.body.login.trim()
        const searchLogin = await userRegistrationModel.findOne({"accountData.login": login})
        const {userId,email} = searchLogin.accountData
        const passwordAccess = await this.authService.createToken(userId,login,email,dateExpired["1h"])
        const passwordRefresh = await this.authService.createToken(userId,login,email,dateExpired["2h"])
        await userRegistrationModel.updateOne({"accountData.login": login},{$set: {"accountData.passwordAccess":passwordAccess,"accountData.passwordRefresh":passwordRefresh}})
        res.cookie("refreshToken",passwordRefresh,{
              secure:true,
              httpOnly:true
        })
        res.status(200).send({accessToken: passwordAccess}) // ??
        return
    }
    async refreshToken(req, res){
        const cookies = req.cookies.refreshToken
        try{
            const userToken = await jwt.verify(cookies,process.env.SECRET_KEY)
            const userId = userToken.userId
            const user = await userRegistrationModel.findOne({"accountData.userId":userId})
            if(user){
                const {login,userId,email} = user.accountData
                const passwordRefresh = await this.authService.createToken(userId,login,email,dateExpired["20sec"])
                const passwordAccess = await this.authService.createToken(userId,login,email,dateExpired["10sec"])
                await userRegistrationModel.updateOne({"accountData.login": login},
                    {$set: {"accountData.passwordRefresh":passwordRefresh }})
                await backListTokenModel.insertMany([{userId,token:cookies}])
                res.cookie("refreshToken",passwordRefresh,{
                    secure:true,
                    httpOnly:true
                })
                res.status(200).send({accessToken: passwordAccess})
                return
            }
        }catch (e) {
            res.send(401)
            return
        }
        res.send(401)
        return
    }
    async logout(req, res){
        const tokenRefresh = req.cookies.refreshToken
        const userCookieToken = await jwt.verify(tokenRefresh, process.env.SECRET_KEY)
        const {userId} = userCookieToken
        await userRegistrationModel.updateOne({"accountData.login": userCookieToken.login},{$set: {"accountData.passwordAccess":"","accountData.passwordRefresh":""}})
        await backListTokenModel.insertMany([{userId:userId,token:tokenRefresh}])
        res.clearCookie("refreshToken")
        res.send(204)
    }
    async me(req, res){
        const token = req.headers?.authorization
        if(token){
            try{
                const verify = jwt.verify(token.split(" ")[1],process.env.SECRET_KEY)
                res.status(200).send({
                    email: verify.email,
                    login: verify.login,
                    userId: verify.userId
                })
                return
            }catch (e) {
                res.send(401)
                return
            }
        }
        res.send(401)
        return
    }
}
