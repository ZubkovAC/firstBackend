import {CountRepositories05} from "../ht_05/repositories/count-repositories05";
const requestIp = require('request-ip')
import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {bloggersCollection, commentsCollection, postsCollection, secret, usersCollection} from "../ht_04/db";
import {errorBloggerId, errorPostId} from "../ht_03/ht_03";
import {registrationToken} from "../ht_05/db";
var jwt = require('jsonwebtoken')



export const validationName15 =
    body('name')
        .trim()
        .isLength({min:3,max:15})
        .withMessage('must be at least 15 chars long')

export const validationYoutubeUrl =
    body('youtubeUrl')
        .trim()
        .isURL()
        .isLength({min:5,max:100})
        .withMessage('must be at least 100 chars long')

export const validationShortDescription =
    body('shortDescription')
        .trim()
        .isLength({min:5,max: 100})
        .withMessage('must be at least 100 chars long')

export const validationTitle =
    body('title')
        .trim()
        .isLength({min:5,max:30})
        .withMessage('must be at least 30 chars long')

export const validationContent =
    body('content')
        .trim()
        .isLength({min:5,max:1000})
        .withMessage('must be at least 1000 chars long')

export const validationContent20_300 =
    body('content')
        .trim()
        .isLength({min:20,max:300})
        .withMessage('validationContent must be at least 300 chars long')

export const validationError = (req: Request, res: Response, next:NextFunction) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400)
            .json({errorsMessages:error
                    .array({onlyFirstError:true})
                    .map( err=>({message:err.msg, field:err.param}))})
    }
    next()
    return
}

export const validationErrorAuth = (req: Request, res: Response, next:NextFunction) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(401)
            .json({errorsMessages:error
                    .array({onlyFirstError:true})
                    .map( err=>({message:err.msg, field:err.param}))})
    }
    next()
    return
}


export const validationErrorCreatePosts = (req: Request, res: Response,next:NextFunction) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        const errorsMessages = error.array().map( err=>({message:err.msg, field:err.param}))
        return res.status(400).json({errorsMessages:errorsMessages})
    }
    next()
    return
}
export const validationErrorCreatePostsv2 = (req: Request, res: Response,newPost) => {
    const error = validationResult(req)
    if(!error.isEmpty() || newPost.status === 400){
        const errorsMessages = error.array().map( err=>({message:err.msg, field:err.param}))
        if(newPost.status === 400){
            console.log(newPost.errorsMessages)
            errorsMessages.push(newPost.errorsMessages)
        }
        return res.status(400).json({errorsMessages:errorsMessages})
    }
}

export const validationErrorUpdatePosts = (req: Request, res: Response,next:NextFunction) => {
    const error = validationResult(req)
    if(!error.isEmpty() || errorPostId.length > 0 || errorBloggerId.length > 0 ){
        const errorsMessages = error.array().map( err=>({message:err.msg, field:err.param}))
        if(errorBloggerId.length > 0){
            errorsMessages.push(...errorBloggerId)
            // @ts-ignore
            errorBloggerId = []
        }
        if(errorPostId.length > 0){
            // @ts-ignore
            errorPostId = []
            res.send(404)
        }
        return res.status(400).json({errorsMessages:errorsMessages})
    }
    next()
}
export const validationPostId = async (req: Request, res: Response,next:NextFunction) => {
    let searchPost = await postsCollection.findOne({id:req.params.id})
    if (searchPost === null){
        errorPostId.push({ message: "non found post ", field: "post" })
    }
    next()
    return
}
export const validationBloggerId = async (req: Request, res: Response,next:NextFunction) => {
    let searchBlogger =  await bloggersCollection.findOne({id:req.body.bloggerId})
    if (searchBlogger === null){
        errorBloggerId.push({ message: "non found bloggerId ", field: "bloggerId" })
    }
    next()
}

export const validationLogin3_10 =
    body('login')
        .trim()
        .isLength({min:3,max:10})
        .withMessage('must be at least 10 chars long login')
export const validationPassword6_20 =
    body('password')
        .trim()
        .isLength({min:6,max:20})
        .withMessage('must be at least 20 chars long password')
export const validationEmail =
    body('email')
        .trim()
        .isEmail()
        .withMessage('not correct email')
export const validationEmailPattern =(req: Request, res: Response,next:NextFunction) => {
        const v =   /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        const testEmail =v.test(req.body.email.trim())
        if(testEmail){
            next()
            return;
        }
        res.status(400).send({
            errorsMessages: [{ message: 'not correct email', field: "email" }]
        })

}

export const validatorFindCommentId = async (req: Request, res: Response,next:NextFunction) => {
    const commentsId = await commentsCollection.findOne({id:req.params.id})
    if(commentsId){
        next()
        return
    }
    res.send(404)
    return
}
export const validatorAccessUserCommentId = async (req: Request, res: Response,next:NextFunction) => {
    let authHeader = req.headers?.authorization
    if(authHeader && authHeader.split(' ')[0] !== "Basic"){
        const parse = jwt.verify(authHeader.split(" ")[1],process.env.SECRET_KEY)
        const userId = await registrationToken.findOne({"accountData.login":parse.login})
        const commentsId = await commentsCollection.findOne({id:req.params.id})
        if(userId.accountData.id === commentsId.userId){
            next()
            return
        }
        res.send(403)
        return
    }
}
export const validatorPostIdComments = async (req: Request, res: Response,next:NextFunction) => {
    const allCommentsPost = await postsCollection.find({idPostComment:req.params.id}).toArray()
    if(allCommentsPost){
        next()
        return
    }
    res.send(404)
    return
}
export const validatorCounterRequest5 = async (req: Request, res: Response,next:NextFunction) => {
    const clientIp = requestIp.getClientIp(req)
    const countIp = await CountRepositories05.count(clientIp,req.path)
    next()
    return
}
export const validatorRequest5 = async (req: Request, res: Response,next:NextFunction) => {
    const clientIp = requestIp.getClientIp(req)
    const countIp = await CountRepositories05.count5Error(clientIp,req.path)
    if(!countIp){
        next()
        return
    }
    res.send(429)
    return
}
export const validatorRequestRegistration5 = async (req: Request, res: Response,next:NextFunction) => {
    const clientIp = requestIp.getClientIp(req)
    const countIp = await CountRepositories05.count5ErrorRegistration(clientIp,req.path)
    if(!countIp){
        next()
        return
    }
    res.send(429)
    return
}
export const validationFindEmail = async (req: Request, res: Response, next:NextFunction) => {
    const searchEmail = await registrationToken.findOne({"accountData.email":req.body.email})
    if(searchEmail === null){
        next()
        return
    }
    res.status(400).send({
        errorsMessages: [{ message: 'this email is busy', field: "email" }]
    })
    return
}
export const validationNoFindEmail = async (req: Request, res: Response, next:NextFunction) => {
    const searchEmail = await registrationToken.findOne({"accountData.email":req.body.email})
    const emails = await registrationToken.find({})
    // if(searchEmail && !searchEmail.emailConformation.isConfirmed){
    if(searchEmail){
        console.log('~~~EMAIL~~~',searchEmail, emails)
        next()
        return
    }
    res.status(400).send({
        errorsMessages: [{ message: 'this email is busy', field: "email" }]
    })
    return
}
export const validationFindLogin = async (req: Request, res: Response, next:NextFunction) => {
    const searchEmail = await registrationToken.findOne({"accountData.login":req.body.login})
    if(searchEmail === null){
        next()
        return
    }
    res.status(400).send({
     errorsMessages: [{ message: 'this login is busy', field: "login" }]
    })
    return
}
