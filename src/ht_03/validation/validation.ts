
import {body, validationResult} from "express-validator";
import {Request, Response} from "express";

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

export const validationError = (req: Request, res: Response) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400)
            .json({errorsMessages:error
                    .array({onlyFirstError:true})
                    .map( err=>({message:err.msg, field:err.param}))})
    }
}

export const validationErrorCreatePosts = (req: Request, res: Response,newPost) => {
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

export const validationErrorUpdatePosts = (req: Request, res: Response,updatePostId) => {
    const error = validationResult(req)
    if(!error.isEmpty() || updatePostId.status === 400 || updatePostId.status === 404){
        if(updatePostId.status === 404){
            res.send(404)
            return
        }
        const errorsMessages = error.array().map( err=>({message:err.msg, field:err.param}))
        if(updatePostId.status === 400){
            errorsMessages.push(...updatePostId.errorsMessages)
        }
        return res.status(400).json({errorsMessages:errorsMessages})
    }
    return res.send(204)
}

