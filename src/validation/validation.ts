import {CountRepositories07} from "../ht_07/repositories/count-repositories07";
const requestIp = require('request-ip')
import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {
    backListTokenModel,
    bloggersCollectionModel,
    commentsCollectionModel,
    postsCollectionModel,
    userRegistrationModel
} from "../ht_07/db";
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

export let errorBloggerId =[]
export let errorPostId =[]

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

export const validationLikeStatus = (req: Request, res: Response, next:NextFunction) => {
    const likeStatus = req.body.likeStatus
    if(likeStatus === "None" || likeStatus === "Like" || likeStatus === "Dislike"){
        next()
        return
    }
    res.status(400).send({
        "errorsMessages": [
            {
                "message": "no correct likeStatus None | Like | Dislike",
                "field": "likeStatus"
            }
        ]
    })
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
    let searchPost = await postsCollectionModel.findOne({id:req.params.id})
    if (searchPost === null){
        errorPostId.push({ message: "non found post ", field: "post" })
    }
    next()
    return
}
export const validationBloggerId = async (req: Request, res: Response,next:NextFunction) => {
    let searchBlogger =  await bloggersCollectionModel.findOne({id:req.body.bloggerId})
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
    const commentsId = await commentsCollectionModel.findOne({id:req.params.id})
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
        const userId = await userRegistrationModel.findOne({"accountData.login":parse.login})
        const commentsId = await commentsCollectionModel.findOne({id:req.params.id})
        if(userId.accountData.userId === commentsId.userId){
            next()
            return
        }
        res.send(403)
        return
    }
}
export const validatorPostIdComments = async (req: Request, res: Response,next:NextFunction) => {
    const allCommentsPost = await postsCollectionModel.find({idPostComment:req.params.id}).lean()
    if(allCommentsPost){
        next()
        return
    }
    res.send(404)
    return
}
export const validatorCounterRequest5 = async (req: Request, res: Response,next:NextFunction) => {
    const clientIp = requestIp.getClientIp(req)
    const countIp = await CountRepositories07.count(clientIp,req.path)
    next()
    return
}
export const validatorRequest5 = async (req: Request, res: Response,next:NextFunction) => {
    const clientIp = requestIp.getClientIp(req)
    const countIp = await CountRepositories07.count5Error(clientIp,req.path)
    if(!countIp){
        next()
        return
    }
    res.send(429)
    return
}

export const validationFindEmail = async (req: Request, res: Response, next:NextFunction) => {
    const searchEmail = await userRegistrationModel.findOne({"accountData.email":req.body.email})
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
    const searchEmail = await userRegistrationModel.findOne({"accountData.email":req.body.email})
    if(searchEmail && !searchEmail.emailConformation.isConfirmed ){
        next()
        return
    }
    res.status(400).send({
        errorsMessages: [{ message: 'this email is busy', field: "email" }]
    })
    return
}
export const validationFindLogin = async (req: Request, res: Response, next:NextFunction) => {
    const searchEmail = await userRegistrationModel.findOne({"accountData.login":req.body.login})
    if(searchEmail === null){
        next()
        return
    }
    res.status(400).send({
     errorsMessages: [{ message: 'this login is busy', field: "login" }]
    })
    return
}
export const validationFindAndCheckCode = async (req: Request, res: Response, next:NextFunction) => {
    const code = req.body.code
    const infoCode = await userRegistrationModel.findOne({"emailConformation.conformationCode":code})
    if(infoCode === null) {
        res.status(400).send({
            errorsMessages: [{ message: 'not find code', field: "code" }]
        })
        return
    }
    if(infoCode.emailConformation.isConfirmed){
        res.status(400).send({
            errorsMessages: [{ message: 'email is Conformed', field: "code" }]
        })
        return
    }
    if(infoCode && infoCode.emailConformation.expirationDate < new Date()){
        res.send(400)
        return
    }
    next()
    return
}
export const validationFindUser = async (req: Request, res: Response, next:NextFunction) => {
    const login = req.body.login.trim()
    const password = req.body.password.trim()
    const searchLogin = await userRegistrationModel.findOne({"accountData.login": login})
    if (searchLogin ) {
        const verify = await bcrypt.compare(password,searchLogin.accountData.hash)
        if(verify){
            next()
            return
        }
    }
    res.send(401)
    return
}
export const validationRefreshToken = async (req: Request, res: Response, next:NextFunction) => {
    const cookies = req.cookies?.refreshToken
    if(cookies){
        const t = await backListTokenModel.findOne({token:cookies})
        if(t){
            res.send(401)
            return
        }
    }
    if(!cookies){
        res.send(401)
        return
    }
    next()
    return
}
export const validationLogout = async (req: Request, res: Response, next:NextFunction) => {
    const tokenRefresh = req.cookies.refreshToken
    if(tokenRefresh){
        const t = await backListTokenModel.findOne({token:tokenRefresh})
        if(t){
            res.send(401)
            return
        }
    }
    if(!tokenRefresh){
        res.send(401)
        return
    }
    try{
        const userCookieToken = await jwt.verify(tokenRefresh, process.env.SECRET_KEY)
        next()
        return
    }catch (e){
        res.send(401)
        return
    }
}
export const validationFindBlogger = async (req: Request, res: Response, next:NextFunction)=>{
    let bloggerId = req.body.bloggerId
    let searchBlogger = await bloggersCollectionModel.findOne({id:bloggerId})
    if(!searchBlogger){
        res.status(400).send({errorsMessages:{ message: "non found bloggerId ", field: "bloggerId" }})
        return
    }
    next()
    return
}