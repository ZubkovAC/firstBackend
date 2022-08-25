import {Request, Response, Router} from "express";
import {serviceUser04} from "../service/service-user";
import {pageNumber, pageSize} from "../function";
import {authorizationMiddleware03} from "../authorization-middleware06/authorization-middleware03";
import {validationErrorCreatePosts, validationLogin3_10, validationPassword6_20} from "../../validation/validation";
var jwt = require('jsonwebtoken')
import { v4 as uuidv4 } from 'uuid'
import {createJWT} from "../helpers/helpers";
import {dateExpired} from "./auth06";
const bcrypt = require('bcrypt')

export const RouterUsers07 = Router({})

RouterUsers07.get('/',
    async (req: Request, res: Response) => {
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const users = await serviceUser04.getUsers(pageN,pageS)
        res.send(users)
        return;
    })
RouterUsers07.post('/',
    authorizationMiddleware03,
    validationLogin3_10,
    validationPassword6_20,
    validationErrorCreatePosts,
    async (req: Request, res: Response) => {
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const email = req.body.email.trim()
        const userId = uuidv4()
        const passwordAccess = await createJWT({userId,login,email},dateExpired["1h"] )
        const passwordRefresh = await createJWT({userId,login,email},dateExpired["2h"] )
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hashSync(password,salt)
        const users = await serviceUser04.createUsers(userId,login,email,passwordAccess,passwordRefresh,hash,salt ,true)
        res.status(201).send(users)
        return;
    })

RouterUsers07.delete('/:id',
    authorizationMiddleware03,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const userId = await serviceUser04.findUserId(id)
        if(userId){
            await serviceUser04.deleteUsers(id)
            res.send(204)
            return
        }
        res.send(404)
        return;
    })
