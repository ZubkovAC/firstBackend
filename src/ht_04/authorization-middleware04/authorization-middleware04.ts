import {NextFunction,Response,Request} from "express";
// import jwt from "jsonwebtoken";
var jwt = require('jsonwebtoken')
import {secret, usersCollection} from "../db";

export const authorizationMiddleware04 = (req: Request, res: Response , next: NextFunction) => {
    let authHeader = req.headers?.authorization
    if(authHeader && authHeader.split(' ')[0] !== "Basic"){
        const parse = jwt.verify(authHeader.split(" ")[1],secret.key)
        const userId = usersCollection.findOne({id:parse.id})
        if(userId){
            next()
            return
        }
    }
    res.send(401)
    return;
}