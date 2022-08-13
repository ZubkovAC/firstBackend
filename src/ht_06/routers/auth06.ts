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


export const RouterAuth06 = Router({})

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

        // 1 repo - key 2 business -  3 adapter - logic  4 manager ( message ) {id: searchLogin.id}, secret.key, {expiresIn: '1h'}
        const id = uuidv4()
        const conformationCode = uuidv4()
        const token =  jwt.sign({ login,password},process.env.SECRET_KEY, {expiresIn: '1h'})
        const user :RegistrationTokenType = await manager.createUser(id,login,email,token,conformationCode)
        await registrationToken06.insertMany([user])
        const transporterInfo = EmailAdapter05.createTransporter(process.env.EMAIL,process.env.PASSWORD)
        const transporter = await nodemailer.createTransport(transporterInfo)
        // const messageRegistration = ManagerAuth05.mesRegistration(conformationCode)
        const sendMailObject = await EmailAdapter05.sendMailer(process.env.EMAIL,email,conformationCode)
        // const info = await transporter.sendMail(sendMailObject)
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
        // const searchEmail = await registrationToken.findOne({"accountData.email":email})

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
    validationLogin3_10,
    validationPassword6_20,
    validationErrorAuth,
    async (req: Request, res: Response) => {
        // const parse = jwt.verify(test,secret.key)
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const searchLogin = await registrationToken06.findOne({"accountData.login": login})

        if (searchLogin && searchLogin.emailConformation.isConfirmed) {
            const verify = jwt.verify(searchLogin.accountData.passwordHash,process.env.SECRET_KEY)
            if(verify.password === password ){
                const token = await jwt.sign({ login,password},process.env.SECRET_KEY, {expiresIn: '1h'})
                await registrationToken06.updateOne({"accountData.login": login},{$set: {"accountData.passwordHash":token}})
                res.status(200).send({token: token})
                return
            }
        }
        res.send(401)
        return
    })
