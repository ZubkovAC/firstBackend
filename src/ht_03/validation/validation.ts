
import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {bloggersCollection, postsCollection} from "../db";
import {errorArray} from "../ht_03";

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
    console.log(errorArray)
    if(!error.isEmpty() || errorArray.length > 0 ){
        const errorsMessages = error.array().map( err=>({message:err.msg, field:err.param}))
        if(errorArray.length > 0){
            errorsMessages.push(...errorArray)
        }
        // @ts-ignore
        errorArray = []
        let status = 400
        if(errorArray.length > 0){
            status = 404
        }
        return res.status(status).json({errorsMessages:errorsMessages})
    }
    next()
}
export const validationPostId = async (req: Request, res: Response,next:NextFunction) => {
    let searchPost = await postsCollection.findOne({id:+req.params.id})
    if (searchPost === null){
        errorArray.push({ message: "non found post ", field: "post" })
    }
    next()
}
export const validationBloggerId = async (req: Request, res: Response,next:NextFunction) => {
    let searchBlogger =  await bloggersCollection.findOne({id:req.body.bloggerId})
    if (searchBlogger === null){
        errorArray.push({ message: "non found bloggerId ", field: "bloggerId" })
    }
    next()
}

