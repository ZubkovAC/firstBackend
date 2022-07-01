import {NextFunction,Response,Request} from "express";

export const authorizationMiddleware03 = (req: Request, res: Response , next: NextFunction) => {

    let authHeader = req.headers?.authorization
    if(authHeader === 'Basic YWRtaW46cXdlcnR5'){
        next()
        return
    }
    res.send(401)
}