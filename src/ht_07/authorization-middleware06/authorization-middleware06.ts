import {NextFunction,Response,Request} from "express";
// import jwt from "jsonwebtoken";
var jwt = require('jsonwebtoken')
import {userRegistrationModel} from "../db";

export const authorizationMiddleware06 = async (req: Request, res: Response , next: NextFunction) => {
    let authHeader = req.headers?.authorization

    if(authHeader && authHeader.split(' ')[0] !== "Basic"){
        try{
            const parse = jwt.verify(authHeader.split(" ")[1],process.env.SECRET_KEY)
            if(parse){
                const userId = await userRegistrationModel.findOne({"accountData.login":parse.login})

                if(userId && userId.emailConformation.isConfirmed && userId.accountData.passwordAccess === authHeader.split(" ")[1] ){
                    next()
                    return
                }
            }
        }catch {
            res.send(401)
            return;
        }
    }
    res.send(401)
    return;
}
