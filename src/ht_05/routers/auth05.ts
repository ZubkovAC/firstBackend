import {Request, Response, Router} from "express";
import {validationErrorAuth, validationLogin3_10, validationPassword6_20} from "../../validation/validation";
import {secret, usersCollection} from "../db";
import nodemailer from 'nodemailer'
var jwt = require('jsonwebtoken')

export const RouterAuth05 = Router({})

RouterAuth05.post("/registration-confirmation",
    async (req, res) => {
        res.send(`registration-confirmation + ${process.env.EMAIL} + ${process.env.PASSWORD}`)
        return

})
RouterAuth05.post("/registration",
    async (req, res) => {
    const login = req.body.login
    const password = req.body.password
    const email = req.body.email
        let transporter = nodemailer.createTransport({
            service:"gmail",
            // secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL, // generated ethereal user
                pass:  process.env.PASSWORD, // generated ethereal password
            },
        });
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: `${process.env.EMAIL}`, // list of receivers
            subject: "Registration ✔", // Subject line
            text: "Access Email", // plain text body
            html: "<b>Hello world?</b>", // html body
        });
            res.send('registration')
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
        const searchLogin = await usersCollection.findOne({login:login})
        if(searchLogin && searchLogin.password === password){
            const token = jwt.sign({id:searchLogin.id},secret.key,{expiresIn:'1h'})
            res.status(200).send({token:token})
            return
        }
        res.status(401).send('If the password or login is wrong')
        return
})
