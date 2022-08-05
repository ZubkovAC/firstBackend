import {Request, Response, Router} from "express";
import {validationErrorAuth, validationLogin3_10, validationPassword6_20} from "../../validation/validation";
import {secret, usersCollection} from "../db";
var jwt = require('jsonwebtoken')

export const RouterAuth05 = Router({})

RouterAuth05.post("/registration-confirmation",
    async (req, res) => {
        res.send('registration-confirmation')
        return

})
RouterAuth05.post("/registration",
    async (req, res) => {
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
