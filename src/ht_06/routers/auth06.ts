import {Request, Response, Router} from "express";
import {
    validationEmail, validationEmailPattern,
    validationError,
    validationErrorAuth, validationFindEmail, validationFindLogin,
    validationLogin3_10, validationNoFindEmail,
    validationPassword6_20, validatorCounterRequest5,
    validatorRequest5
} from "../../validation/validation";
import {registrationToken06} from "../db";
import {EmailAdapter05} from "../adapter/emailAdapter";
import {manager} from "../managerAuth/managerAuth";
// var nodemailer = require("nodemailer")
import * as nodemailer from "nodemailer"
var jwt = require('jsonwebtoken')
import { v4 as uuidv4 } from 'uuid'
import {RegistrationTokenType} from "../types";
import {authorizationMiddleware06} from "../authorization-middleware06/authorization-middleware06";
import {addSeconds} from "date-fns";


export const RouterAuth06 = Router({})

const dateExpired={
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
            res.send(204) // work
            return
        }
        res.send(400) // work
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
        const token =  jwt.sign({userId, login,email,password},
            process.env.SECRET_KEY,
            // {expiresIn: dateExpired["10sec"]}),
            {expiresIn: dateExpired["1h"]})
        const refreshPassword = jwt.sign({ userId,login,email,password},
            process.env.SECRET_KEY,
            // {expiresIn: dateExpired["20sec"]},
            {expiresIn: dateExpired["2h"]}
        )
        const conformationCode = uuidv4()
        const user :RegistrationTokenType = await manager.createUser(userId,refreshPassword,login,email,token,conformationCode)
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

        const searchEmail = await registrationToken06.findOne({"accountData.email":email})

        const {userId,login , passwordHash } = searchEmail.accountData
        const password = jwt.verify(passwordHash,process.env.SECRET_KEY).password

        const conformationCode = uuidv4()
        const newEmail = await  manager.updateUser(email,conformationCode)
        const transporterInfo = EmailAdapter05.createTransporter(process.env.EMAIL,process.env.PASSWORD)
        const transporter = await nodemailer.createTransport(transporterInfo)
        // const messageRegistration = ManagerAuth05.mesRegistration(conformationCode)
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
            console.log(searchLogin)
                const verify = jwt.verify(searchLogin.accountData.passwordHash,process.env.SECRET_KEY)
                if(verify.password === password ){
                    const userId = searchLogin.accountData.userId
                    const email = searchLogin.accountData.email
                    const token = await jwt.sign({ userId,login,email,password:verify.password},process.env.SECRET_KEY, {expiresIn: dateExpired["1h"]})
                    await registrationToken06.updateOne({"accountData.login": login},{$set: {"accountData.passwordHash":token}})
                    res.cookie("refresh",searchLogin.accountData.passwordHash,{
                        secure:true,
                        httpOnly:true
                    })
                    res.status(200).send({token: token}) // ??
                    return
                }
        }
        res.send(401)
        return
    })

RouterAuth06.post('/refresh-token',
    async (req: Request, res: Response) => {

        const token = req?.cookies.refreshToken
        console.log('refresh',token)
        if(token){
            try{
                const parse = jwt.verify(token,process.env.SECRET_KEY)
                const login = parse.login
                const password = parse.password
                const passwordHash = await jwt.sign({ login,password},process.env.SECRET_KEY, {expiresIn: dateExpired["10sec"]})
                await registrationToken06.updateOne({"accountData.login": parse.login},{$set: {"accountData.passwordHash":passwordHash}})
                res.status(200).send({accessToken: passwordHash})
                return
            }catch (e) {
                if(req.cookies.refreshToken){
                   const user = await registrationToken06.findOne({"emailConformation.conformationCode":req.cookies.refreshToken})
                    if(user){
                        const dateUser  = await jwt.verify(user,process.env.SECRET_KEY)
                        const login = dateUser.login
                        const password = dateUser.password
                        const passwordHash = await jwt.sign({ login,password},process.env.SECRET_KEY, {expiresIn:  dateExpired["10sec"]})
                        await registrationToken06.updateOne({"accountData.login": user.accountData.login},{$set: {"accountData.passwordHash":passwordHash}})
                        res.status(200).send({accessToken: passwordHash})
                        return
                    }
                }
            }
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
           const {userId, password, email, login} = userCookieToken
          const userCookie = jwt.sign({userId, password, email, login}, process.env.SECRET_KEY,{expiresIn: '1sec'})
           await registrationToken06.updateOne({"accountData.login": userCookieToken.login},{$set: {"accountData.passwordHash":userCookie}})
           res.clearCookie("refresh")
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
        const verify = jwt.verify(token.split(" ")[1],process.env.SECRET_KEY)
        console.log(req.cookies.refreshToken)
        res.status(200).send({
            email: verify.email,
            login: verify.login,
            userId: verify.userId
        })
        return
    })
