import {Request, Response, Router} from "express";
import {
    validationEmail, validationEmailPattern,
    validationError,
    validationErrorAuth, validationFindEmail, validationFindLogin,
    validationLogin3_10, validationNoFindEmail,
    validationPassword6_20, validatorCounterRequest5,
    validatorRequest5
} from "../../validation/validation";
import {registrationToken06, registrationTokenTest, usersCollection06} from "../db";
import {EmailAdapter05} from "../adapter/emailAdapter";
import {manager} from "../managerAuth/managerAuth";
// var nodemailer = require("nodemailer")
import * as nodemailer from "nodemailer"
var jwt = require('jsonwebtoken')
import { v4 as uuidv4 } from 'uuid'
import {RegistrationTokenType} from "../types";
import {authorizationMiddleware06} from "../authorization-middleware06/authorization-middleware06";
import {addSeconds} from "date-fns";
const bcrypt = require('bcrypt')

export const RouterAuth06 = Router({})

export const dateExpired={
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

        const accessToken = await jwt.sign({userId, login,email,password},
            process.env.SECRET_KEY,
            // {expiresIn: dateExpired["10sec"]}),
            {expiresIn: dateExpired["1h"]})
        const conformationCode = uuidv4()
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hashSync( password,salt)
        const user :RegistrationTokenType = await manager.createUser(userId,login,email,conformationCode,passwordHash,salt,accessToken)

        await registrationTokenTest.insertMany([user]) // TEST
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

        const {userId,login , passwordAccess } = searchEmail.accountData
        // const password = jwt.verify(passwordAccess,process.env.SECRET_KEY).password

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
                const verify = jwt.verify(searchLogin.accountData.passwordAccess,process.env.SECRET_KEY)
                if(verify.password === password ){
                    const userId = searchLogin.accountData.userId
                    const email = searchLogin.accountData.email
                    // refreshToken
                    const salt = await bcrypt.genSalt(10)
                    const refToken =    await jwt.sign({login,email,password},process.env.SECRET_KEY,{expiresIn:'2h'})
                    const passwordH = await bcrypt.hashSync( password,salt)
                    const passwordRefresh = passwordH + "." + refToken

                    await registrationToken06.updateOne({"accountData.login": login},{$set: {"accountData.refreshPassword":passwordRefresh,"accountData.salt":passwordH}})
                    console.log("222",passwordRefresh)
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
        const Token = req.headers.authorization.split(" ")[1]
        console.log("333",refreshToken)
        const user1 = await registrationToken06.findOne({"accountData.passwordAccess":Token})
        console.log('user',user1)
        const user = await registrationToken06.findOne({"accountData.passwordRefresh":refreshToken})
        console.log('user',user)
        if(user){
            try{
                const user = await registrationToken06.findOne({"accountData.passwordRefresh":refreshToken})
                const deToken = user.accountData.passwordAccess.split('.')[1]
                const userToken = await jwt.verify(deToken,process.env.SECRET_KEY)
                const login = user.accountData.login
                const userId = user.accountData.userId
                const email = user.accountData.email
                const salt = await bcrypt.genSalt(10)
                console.log('userPass',userToken.password)
                const passwordRefresh = await bcrypt.hashSync( userToken.password,salt)
                await registrationToken06.updateOne({"accountData.login": login},
                    {$set: {"accountData.passwordRefresh":passwordRefresh ,
                        "accountData.salt":salt}})
                res.status(200).send({accessToken: user.accountData.passwordAccess})
                return
            }catch (e) {
                if(req.cookies.refreshToken){
                   const user = await registrationToken06.findOne({"accountData.passwordRefresh":req.cookies.refreshToken})
                    if(user){
                        const tokenUser = user.accountData.passwordAccess.split('.')[1]
                        const dateUser  = await jwt.verify(tokenUser,process.env.SECRET_KEY)
                        const login = dateUser.login
                        const password = dateUser.password
                        const userId = dateUser.userId
                        const email = dateUser.email
                        const passwordAccess = await jwt.sign({ userId,email,login},process.env.SECRET_KEY, {expiresIn:  dateExpired["10sec"]})
                        await registrationToken06.updateOne({"accountData.login": user.accountData.login},{$set: {"accountData.passwordAccess":passwordAccess}})
                        res.status(200).send({accessToken: passwordAccess})
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
          const userCookie = jwt.sign({userId, password, email, login}, process.env.SECRET_KEY,{expiresIn: '0sec'})
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
