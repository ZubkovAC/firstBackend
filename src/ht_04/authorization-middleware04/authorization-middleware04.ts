import {NextFunction,Response,Request} from "express";
// import jwt from "jsonwebtoken";
var jwt = require('jsonwebtoken')
import {secret, usersCollection} from "../db";

export const authorizationMiddleware04 = (req: Request, res: Response , next: NextFunction) => {
    let authHeader = req.headers?.authorization
    const parse = jwt.verify(authHeader.split(" ")[1],secret.key)
    const userId = usersCollection.find({id:parse.id})
    if(userId){
        next()
        return
    }
    res.send(401)
}