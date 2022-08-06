import {Request, Response, Router} from "express";
import {validationErrorAuth, validationLogin3_10, validationPassword6_20} from "../../validation/validation";
import {secret, usersCollection} from "../db";
var nodemailer = require("nodemailer")
var jwt = require('jsonwebtoken')
const requestIp = require('request-ip')

export const RouterAuth05 = Router({})

RouterAuth05.post("/registration-confirmation",
    async (req, res) => {
        const clientIp = requestIp.getClientIp(req)
        res.send(`IP-IP +  ${clientIp} `)
        return
    })

RouterAuth05.post("/registration",
    async (req, res) => {

        const login = req.body.login
        const password = req.body.password
        const email = req.body.email

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        let info = await transporter.sendMail({
            from: 'Me-me', // sender address
            to: email, // list of receivers
            subject: "Registration ✔", // Subject line
            text: "Access Email", // plain text body
            html: "https://ferst-back.herokuapp.com/ht_05/api/auth/confirm-registration?code=youtcodehere", // html body
        });
        console.log('info-registration',info)
        res.send({
            email: email,
            login: login,
            password: password
        })
        return
    })
RouterAuth05.post("/registration-email-resending",
    async (req, res) => {
        res.send('registration-email-resending')
        return
    })
RouterAuth05.post('/login',
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
