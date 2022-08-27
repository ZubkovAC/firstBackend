import {Request, Response} from "express";
import {pageNumber, pageSize} from "../function";
import {v4 as uuidv4} from "uuid";
import {createJWT} from "../helpers/helpers";
import {dateExpired} from "../routers/auth07";
import {inject, injectable} from "inversify";
import {UserService} from "../service/service-user";
const bcrypt = require('bcrypt')

@injectable()
export class UserController {
    constructor(@inject(UserService) protected userService:UserService) {
    }
    async getUsers(req: Request, res: Response){
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const users = await this.userService.getUsers(pageN,pageS)
        res.send(users)
        return;
    }
    async createUser(req: Request, res: Response){
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const email = req.body.email.trim()
        const userId = uuidv4()
        const passwordAccess = await createJWT({userId,login,email},dateExpired["1h"] )
        const passwordRefresh = await createJWT({userId,login,email},dateExpired["2h"] )
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hashSync(password,salt)
        const users = await this.userService.createUsers(userId,login,email,passwordAccess,passwordRefresh,hash,salt ,true)
        res.status(201).send(users)
        return;
    }
    async deleteUser(req: Request, res: Response){
        const id = req.params.id
        const userId = await this.userService.findUserId(id)
        if(userId){
            await this.userService.deleteUsers(id)
            res.send(204)
            return
        }
        res.send(404)
        return;
    }

}
