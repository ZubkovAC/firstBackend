import {NextFunction,Response,Request} from "express";

export const authorizationMiddleware = (req: Request, res: Response ,next: NextFunction) => {
    let authorization = req.headers.authorization.split(' ')[1]
    if(authorization === 'YWRtaW46cXdlcnR5'){
        next()
        return
    }
    res.send(401)
}