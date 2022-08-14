import {Request, Response, Router} from "express";
import {serviceUser04} from "../service/service-user";
import {pageNumber, pageSize} from "../function";
import {authorizationMiddleware03} from "../authorization-middleware06/authorization-middleware03";
import {validationErrorCreatePosts, validationLogin3_10, validationPassword6_20} from "../../validation/validation";
import {usersCollectionTest} from "../db";

export const RouterUsers06 = Router({})

RouterUsers06.get('/',
    async (req: Request, res: Response) => {
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const users = await serviceUser04.getUsers(pageN,pageS)
        res.send(users)
        return;
    })
RouterUsers06.post('/',
    authorizationMiddleware03,
    validationLogin3_10,
    validationPassword6_20,
    validationErrorCreatePosts,
    async (req: Request, res: Response) => {
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const email = req.body.email.trim()
        const users = await serviceUser04.createUsers(login,password,email)
        res.status(201).send(users)
        return;
    })
RouterUsers06.delete('/:id',
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
