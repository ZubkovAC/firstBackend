import {NextFunction,Response,Request} from "express";
// import jwt from "jsonwebtoken";
var jwt = require('jsonwebtoken')
import {secret, usersCollection} from "../db";

export const authorizationMiddleware05 = async (req: Request, res: Response , next: NextFunction) => {
    let authHeader = req.headers?.authorization
    // console.log("authHeader04",authHeader)
    if(authHeader && authHeader.split(' ')[0] !== "Basic"){
        try{
            const parse = jwt.verify(authHeader.split(" ")[1],secret.key)
            if(parse){
                const userId = await usersCollection.findOne({id:parse.id})
                if(userId){
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