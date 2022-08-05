import {Request, Response, Router} from "express";
import {serviceUser04} from "../service/service-user";
import {pageNumber, pageSize} from "../function";
import {authorizationMiddleware03} from "../../ht_03/authorization-middleware/authorization-middleware03";
import {validationErrorCreatePosts, validationLogin3_10, validationPassword6_20} from "../../validation/validation";

export const RouterUsers05 = Router({})

RouterUsers05.get('/',
    async (req: Request, res: Response) => {
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const users = await serviceUser04.getUsers(pageN,pageS)
        res.send(users)
        return;
    })
RouterUsers05.post('/',
    authorizationMiddleware03,
    validationLogin3_10,
    validationPassword6_20,
    validationErrorCreatePosts,
    async (req: Request, res: Response) => {
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const users = await serviceUser04.createUsers(login,password)
        res.status(201).send(users)
        return;
    })
RouterUsers05.delete('/:id',
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
