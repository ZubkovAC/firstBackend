import {Request, Response, Router} from "express";
import {
    validationEmail, validationEmailPattern,
    validationError,
    validationErrorAuth, validationFindEmail, validationFindLogin,
    validationLogin3_10,
    validationPassword6_20, validatorCounterRequest5,
    validatorRequest5
} from "../../validation/validation";
import {registrationToken, secret, usersCollection} from "../db";
import {EmailAdapter05} from "../adapter/emailAdapter";
import {ManagerAuth05} from "../managerAuth/managerAuth";
var nodemailer = require("nodemailer")
var jwt = require('jsonwebtoken')
import { v4 as uuidv4 } from 'uuid'
import { add } from "date-fns";
export const RouterAuth05 = Router({})

RouterAuth05.post("/registration-confirmation",
    validatorRequest5,
    validatorCounterRequest5,
    async (req, res) => {
        const code = req.body.code
        console.log('code',code)
        const infoCode = await registrationToken.findOne({"emailConformation.conformationCode":code})
        console.log('infoCode',infoCode)
        if(infoCode === null) {
            res.status(400).send({
                errorsMessages: [{ message: 'not find code', field: "code" }]
            })
            return
        }
        if(infoCode.emailConformation.isConfirmed){
            res.send(400)
            return
        }
        if(infoCode && infoCode.emailConformation.expirationDate > new Date()){
           await registrationToken.updateOne({"emailConformation.conformationCode":code},{ $set:{"emailConformation.isConfirmed":true}})
            const infoCode = await registrationToken.findOne({"emailConformation.conformationCode":code})
            console.log(infoCode)
            res.send(204) // work
            return
        }
        res.send(400) // work
        return
    })


RouterAuth05.post("/registration",
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
        const token =  jwt.sign({id, login,email,password},secret.key, {expiresIn: '1h'})
        const user = {
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
        await registrationToken.insertOne(user)
        // const  obj = jwt.verify(token,secret.key)
        const transporterInfo = EmailAdapter05.createTransporter(process.env.EMAIL,process.env.PASSWORD)
        const transporter = await nodemailer.createTransport(transporterInfo)
        const messageRegistration = ManagerAuth05.mesRegistration(conformationCode)
        const sendMailObject = EmailAdapter05.sendMailer(process.env.EMAIL,email,messageRegistration)
        const info = await transporter.sendMail(sendMailObject)
        res.status(204).send("Input data is accepted. Email with confirmation code will be send to passed email address")
        return
    })
RouterAuth05.post("/registration-email-resending",
    validatorRequest5,
    validatorCounterRequest5,
    validationEmailPattern,
    validationError,
    async (req, res) => {
        const email = req.body.email
        const searchEmail = await registrationToken.findOne({"accountData.email":email})
        if(searchEmail && !searchEmail.emailConformation.isConfirmed){
            const conformationCode = uuidv4()
            const newEmail = await registrationToken.updateOne(
                {"accountData.email":searchEmail.accountData.email},
                { $set:
                        {
                            "emailConformation.conformationCode":conformationCode,
                            "emailConformation.isConfirmed":false,
                            "emailConformation.expirationDate":add(new Date(),{minutes:5})
                        }
                })
            const transporterInfo = EmailAdapter05.createTransporter(process.env.EMAIL,process.env.PASSWORD)
            const transporter = await nodemailer.createTransport(transporterInfo)
            const messageRegistration = ManagerAuth05.mesRegistration(conformationCode)
            const sendMailObject = EmailAdapter05.sendMailer(process.env.EMAIL,email,messageRegistration)
            const info = await transporter.sendMail(sendMailObject)
            res.send(204)
            return
        }
        res.send(400)
        return
    })
RouterAuth05.post('/login',
    validatorRequest5,
    validatorCounterRequest5,
    validationLogin3_10,
    validationPassword6_20,
    validationErrorAuth,
    async (req: Request, res: Response) => {
        // const parse = jwt.verify(test,secret.key)
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const searchLogin = await usersCollection.findOne({login: login})
        if (searchLogin && searchLogin.password === password) {
            const token = jwt.sign({id: searchLogin.id}, secret.key, {expiresIn: '1h'})
            res.status(200).send({token: token})
            return
        }
        res.status(401).send('If the password or login is wrong')
        return
    })
// d49074cb-4821-4b3b-ab9d-ee2a18d5b6ab
// d49074cb-4821-4b3b-ab9d-ee2a18d5b6ab