import {NextFunction,Response,Request} from "express";

export const authorizationMiddleware03 = (req: Request, res: Response , next: NextFunction) => {

    let authHeader = req.headers?.authorization
    console.log("authHeader03",authHeader)
    if(authHeader === 'Basic YWRtaW46cXdlcnR5'){
        next()
        return
    }
    res.send(401)
}