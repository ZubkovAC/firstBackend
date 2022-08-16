import {Request, Response, Router} from "express";
import {
    validationEmail, validationEmailPattern,
    validationError,
    validationFindEmail, validationFindLogin,
    validationLogin3_10, validationNoFindEmail,
    validationPassword6_20, validatorCounterRequest5,
    validatorRequest5
} from "../../validation/validation";
import {registrationToken06, registrationTokenTest} from "../db";
import {EmailAdapter05} from "../adapter/emailAdapter";
import {manager} from "../managerAuth/managerAuth";
import * as nodemailer from "nodemailer"
var jwt = require('jsonwebtoken')
import { v4 as uuidv4 } from 'uuid'
import {RegistrationTokenType} from "../types";
import {authorizationMiddleware06} from "../authorization-middleware06/authorization-middleware06";
import {createJWT} from "../helpers/helpers";
import {create} from "domain";
const bcrypt = require('bcrypt')

export const RouterAuth06 = Router({})

export const dateExpired={
    "0":"0sec",
    '10sec':'10sec',
    '20sec':'20sec',
    '1h':'1h',
    '2h':'2h'
}

RouterAuth06.post("/registration-confirmation",
    validatorRequest5,
    validatorCounterRequest5,
    async (req, res) => {
        const code = req.body.code
        const infoCode = await registrationToken06.findOne({"emailConformation.conformationCode":code})
        if(infoCode === null) {
            res.status(400).send({
                errorsMessages: [{ message: 'not find code', field: "code" }]
            })
            return
        }
        if(infoCode.emailConformation.isConfirmed){
            res.status(400).send({
                errorsMessages: [{ message: 'email is Conformed', field: "code" }]
            })
            return
        }
        if(infoCode && infoCode.emailConformation.expirationDate > new Date()){
           await registrationToken06.updateOne({"emailConformation.conformationCode":code},{ $set:{"emailConformation.isConfirmed":true}})
            const infoCode = await registrationToken06.findOne({"emailConformation.conformationCode":code})
            res.send(204)
            return
        }
        res.send(400)
        return
    })

RouterAuth06.post("/registration",
    validatorRequest5,
    validatorCounterRequest5,
    validationLogin3_10,
    validationPassword6_20,
    validationEmail,
    validationError,
    validationEmailPattern,
    validationFindEmail,
    validationFindLogin,
    async (req, res) => {

        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const email = req.body.email.trim()
        const userId = uuidv4()
        const conformationCode = uuidv4()
        const passwordAccess = await createJWT({userId, login,email},dateExpired["1h"])
        const passwordRefresh = await createJWT({userId, login,email},dateExpired["2h"])
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hashSync( password,salt)
        const user :RegistrationTokenType = await manager.createUser(login,email,passwordAccess,passwordRefresh,salt,passwordHash,userId,conformationCode)
        await registrationToken06.insertMany([user])
        const transporterInfo = EmailAdapter05.createTransporter(process.env.EMAIL,process.env.PASSWORD)
        const transporter = await nodemailer.createTransport(transporterInfo)
        const sendMailObject = await EmailAdapter05.sendMailer(process.env.EMAIL,email,conformationCode)
        const info = await transporter.sendMail(sendMailObject)
        res.send(204)
        return
    })
RouterAuth06.post("/registration-email-resending",
    validatorRequest5,
    validatorCounterRequest5,
    validationEmailPattern,
    validationNoFindEmail,
    async (req, res) => {
        const email = req.body.email

        // const searchEmail = await registrationToken06.findOne({"accountData.email":email})
        const conformationCode = uuidv4()
        const newEmail = await  manager.updateUser(email,conformationCode)
        const transporterInfo = EmailAdapter05.createTransporter(process.env.EMAIL,process.env.PASSWORD)
        const transporter = await nodemailer.createTransport(transporterInfo)
        const sendMailObject = await EmailAdapter05.sendMailer(process.env.EMAIL,email,conformationCode)
        const info = await transporter.sendMail(sendMailObject)
        res.send(204)
        return
    })
RouterAuth06.post('/login',
    validatorRequest5,
    validatorCounterRequest5,
    async (req: Request, res: Response) => {
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const searchLogin = await registrationToken06.findOne({"accountData.login": login})
        if (searchLogin ) {
                const verify = await bcrypt.compare(password,searchLogin.accountData.salt)
                if(verify){
                    const userId = searchLogin.accountData.userId
                    const email = searchLogin.accountData.email
                    const login = searchLogin.accountData.email
                    const passwordAccess =    await createJWT({userId,login,email},dateExpired["10sec"])
                    const passwordRefresh =    await createJWT({userId,login,email},dateExpired["20sec"])
                    await registrationToken06.updateOne({"accountData.login": login},{$set: {"accountData.passwordAccess":passwordAccess,"accountData.passwordRefresh":passwordRefresh}})
                    // console.log("222",passwordRefresh)
                    res.cookie("refreshToken",passwordRefresh,{
                        // secure:true,
                        // httpOnly:true
                    })
                    res.status(200).send({accessToken: searchLogin.accountData.passwordAccess}) // ??
                    return
                }
        }
        res.send(401)
        return
    })

RouterAuth06.post('/refresh-token',
    async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken
        // const Token = req.headers.authorization.split(" ")[1]
        // const user1 = await registrationToken06.findOne({"accountData.passwordAccess":Token})
        const user = await registrationToken06.findOne({"accountData.passwordRefresh":refreshToken})
        if(user){
                const login = user.accountData.login
                const userId = user.accountData.userId
                const email = user.accountData.email
                const passwordRefresh = await createJWT({userId,login,email},dateExpired["20sec"])
                await registrationToken06.updateOne({"accountData.login": login},
                    {$set: {"accountData.passwordRefresh":passwordRefresh }})
                res.status(200).send({accessToken: user.accountData.passwordAccess})
                return
        }
        res.send(401)
        return
    })

RouterAuth06.post('/logout',
    async (req: Request, res: Response) => {
        // const token = req.headers.authorization.split(" ")[1]
       const tokenRefresh = req.cookies.refreshToken
       if(!tokenRefresh){
           res.send(401)
           return
       }
       try{
          const userCookieToken = jwt.verify(tokenRefresh, process.env.SECRET_KEY)
           const {userId, email, login} = userCookieToken
          const userCookie = createJWT({userId,login,email}, dateExpired["0"])
           await registrationToken06.updateOne({"accountData.login": userCookieToken.login},{$set: {"accountData.passwordAccess":userCookie,"accountData.passwordRefresh":userCookie}})
           res.clearCookie("refreshToken")
           res.send(204)
       }catch (e) {
           res.send(401)
           return
       }
    })
RouterAuth06.get('/me',
    authorizationMiddleware06,
    async (req: Request, res: Response) => {
        const token = req.headers.authorization
        if(token){
            const verify = jwt.verify(token.split(" ")[1],process.env.SECRET_KEY)
            console.log(req.cookies.refreshToken)
            res.status(200).send({
                email: verify.email,
                login: verify.login,
                userId: verify.userId
            })
            return
        }
        res.send(401)
        return

    })
