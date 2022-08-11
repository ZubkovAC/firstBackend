import {Request, Response, Router} from "express";
import {
    validationEmail, validationEmailPattern,
    validationError,
    validationErrorAuth, validationFindEmail, validationFindLogin,
    validationLogin3_10, validationNoFindEmail,
    validationPassword6_20, validatorCounterRequest5,
    validatorRequest5, validatorRequestRegistration5
} from "../../validation/validation";
import {registrationToken, secret, usersCollection} from "../db";
import {EmailAdapter05} from "../adapter/emailAdapter";
import {manager, ManagerAuth05} from "../managerAuth/managerAuth";
// var nodemailer = require("nodemailer")
import * as nodemailer from "nodemailer"
var jwt = require('jsonwebtoken')
import { v4 as uuidv4 } from 'uuid'


export const RouterAuth05 = Router({})

RouterAuth05.post("/registration-confirmation",
    validatorRequest5,
    validatorCounterRequest5,
    async (req, res) => {
        const code = req.body.code
        const infoCode = await registrationToken.findOne({"emailConformation.conformationCode":code})
        console.log('~~~~~~~INFO 1~~~~~~~~')
        if(infoCode === null) {
            console.log('~~~~~~~INFO 2~~~~~~~~')
            res.status(400).send({
                errorsMessages: [{ message: 'not find code', field: "code" }]
            })
            return
        }
        if(infoCode.emailConformation.isConfirmed){
            console.log('~~~~~~~INFO 3~~~~~~~~')
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
        console.log('~~~~~~~INFO 4~~~~~~~~')
        res.send(400) // work
        return
    })


RouterAuth05.post("/registration",
    validatorCounterRequest5,
    // validatorRequest5,
    validatorRequestRegistration5,
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
        const user = manager.createUser(id,login,email,token,conformationCode)
        await registrationToken.insertOne(user)
        const transporterInfo = EmailAdapter05.createTransporter(process.env.EMAIL,process.env.PASSWORD)
        const transporter = await nodemailer.createTransport(transporterInfo)
        // const messageRegistration = ManagerAuth05.mesRegistration(conformationCode)
        const sendMailObject = await EmailAdapter05.sendMailer(process.env.EMAIL,email,conformationCode)
        const info = await transporter.sendMail(sendMailObject)
        res.send(204)
        return
    })
RouterAuth05.post("/registration-email-resending",
    validatorRequest5,
    validatorCounterRequest5,
    validationEmailPattern,
    validationError,
    validationNoFindEmail,
    async (req, res) => {
        const email = req.body.email
        const searchEmail = await registrationToken.findOne({"accountData.email":email})
        if(!searchEmail.emailConformation.isConfirmed){
            const conformationCode = uuidv4()
            const newEmail = await  manager.updateUser(email,conformationCode)
            const transporterInfo = EmailAdapter05.createTransporter(process.env.EMAIL,process.env.PASSWORD)
            const transporter = await nodemailer.createTransport(transporterInfo)
            // const messageRegistration = ManagerAuth05.mesRegistration(conformationCode)
            const sendMailObject = await EmailAdapter05.sendMailer(process.env.EMAIL,email,conformationCode)
            const info = await transporter.sendMail(sendMailObject)
            res.send(204)
            return
        }
        console.log('~~~~~~~registration-email 2~~~~~~~~')
        res.send(400).send({
            errorsMessages: [{ message: 'this email is busy', field: "email" }]
        })
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
        const searchLogin = await registrationToken.findOne({"accountData.login": login})

        if (searchLogin && searchLogin.emailConformation.isConfirmed) {
            const verify = jwt.verify(searchLogin.accountData.passwordHash,process.env.SECRET_KEY)
            if(verify.password === password ){
                const token = await jwt.sign({ login,password},process.env.SECRET_KEY, {expiresIn: '1h'})
                await registrationToken.updateOne({"accountData.login": login},{$set: {"accountData.passwordHash":token}})
                res.status(200).send({token: token})
                return
            }
        }
        res.status(401).send('If the password or login is wrong')
        return
    })
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InVsb2dpbjQ1IiwicGFzc3dvcmQiOiJxd2VydHkiLCJpYXQiOjE2NjAxMjIxNjIsImV4cCI6MTY2MDEyNTc2Mn0.m-Uy0LDXroA1-yKUMIKxiRb1kiwiqf0x8P5aiCUjLT8
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InVsb2dpbjQ1IiwicGFzc3dvcmQiOiJxd2VydHkiLCJpYXQiOjE2NjAxMjIxNjIsImV4cCI6MTY2MDEyNTc2Mn0.m-Uy0LDXroA1-yKUMIKxiRb1kiwiqf0x8P5aiCUjLT8
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhlMTdlNmEwLTBkMTgtNDA3MC1iNjA5LTMyZWU2MDA5NzU3OSIsImxvZ2luIjoidWxvZ2luNDUiLCJlbWFpbCI6IjN5NmtvYjkwQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoicXdlcnR5IiwiaWF0IjoxNjYwMTE5NjY3LCJleHAiOjE2NjAxMjMyNjd9.lD1gBajTzf2-7bABSEil4R2JDG1XdDXjuzgh8Ciu5q4