import {NextFunction, Request, Response, Router} from "express";
import {bloggersRepositories} from "./repositories/bloggers-repositories";
import {postsRepositories} from "./repositories/posts-repositories";
import {body , validationResult} from "express-validator";
import {authorizationMiddleware} from "./authorization-middleware/authorization-middleware";

export const ht_02_Router = Router({})

let count = 0

const countResponse = (req: Request, res: Response ,next: NextFunction)=>{
    count++
    next()
}

ht_02_Router.get('/api/bloggers',
    countResponse,
    (req: Request, res: Response) => {
    const bloggers = bloggersRepositories.findBloggers()
    console.log(count)
    res.status(200).send(bloggers)
})

ht_02_Router.get('/api/bloggers/:id',(req: Request, res: Response) => {

    const bloggers = bloggersRepositories.findBloggerId(+req.params.id)
    if(bloggers){
        res.status(200).send(bloggers)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return
})

ht_02_Router.post('/api/bloggers',
    authorizationMiddleware,
    body('name').trim().isLength({min:5,max:15}).withMessage('must be at least 15 chars long'),
    body('youtubeUrl').trim().isLength({min:5,max:100}).isURL().withMessage('must be at least 100 chars long'),
    // body('youtubeUrl').trim().isURL().withMessage('no url address '), ??
    (req: Request, res: Response) => {

        const error = validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).json({errorsMessages:error.array({onlyFirstError:true}).map( err=>({message:err.msg, field:err.param}))})
        }
        let name = req.body.name.trim()
        let youtubeUrl = req.body.youtubeUrl.trim()
        const createBlogger = bloggersRepositories.createBlogger(name,youtubeUrl)
        res.status(201).send(createBlogger.newVideo)
    })

ht_02_Router.put('/api/bloggers/:id',
    authorizationMiddleware,
    body('name').trim().isLength({min:5,max:15}).withMessage('must be at least 15 chars long'),
    body('youtubeUrl').trim().isLength({max:100}).isURL().withMessage('must be at least 100 chars long'),
    (req: Request, res: Response) => {
        const error = validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).json({errorsMessages:error.array({onlyFirstError:true}).map( err=>({message:err.msg, field:err.param}))})
        }
        const id = +req.params.id
        const newName = req.body.name
        const newYoutubeUrl = req.body.youtubeUrl
        const updateBlogger = bloggersRepositories.updateBlogger(id,newName,newYoutubeUrl)
        if(updateBlogger.error === 204){
            res.status(204).send(updateBlogger.videoId)
            return
        }
        if(updateBlogger.error === 404){
            res.send(404)
            return
        }
    })

ht_02_Router.delete('/api/bloggers/:id',
    authorizationMiddleware,
    (req: Request, res: Response) => {
    const bloggerDeleteId = +req.params.id
    const removeBlogger = bloggersRepositories.removeBloggerId(bloggerDeleteId)
    if(removeBlogger){
        res.send(204)
        return
    }
    res.send(404)
    return;
})

ht_02_Router.get('/api/posts',(req: Request, res: Response) => {
    const posts =  postsRepositories.findPosts()
    res.status(200).send(posts)
})
ht_02_Router.get('/api/posts/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    const post = postsRepositories.findPostId(id)
    if(post.status){
        res.status(200).send(post.post)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return;
})

ht_02_Router.post('/api/posts',
    authorizationMiddleware,
    body('shortDescription').trim().isLength({min:5,max: 100}).withMessage('must be at least 100 chars long'),
    body('title').trim().isLength({min:5,max:30}).withMessage('must be at least 30 chars long'),
    body('content').trim().isLength({min:5,max:1000}).withMessage('must be at least 1000 chars long'),
    (req: Request, res: Response) => {

        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        const newPost = postsRepositories.createPost(title,shortDescription,content,bloggerId)
        const error = validationResult(req)
        if(!error.isEmpty() || newPost.status === 400){
            const errorsMessages = error.array().map( err=>({message:err.msg, field:err.param}))
            if(newPost.status === 400){
                console.log(newPost.errorsMessages)
                errorsMessages.push(newPost.errorsMessages)
            }
            return res.status(400).json({errorsMessages:errorsMessages})
        }
        res.status(newPost.status).send(newPost.newVideo)
    })

ht_02_Router.put('/api/posts/:id',
    authorizationMiddleware,
    body('shortDescription').trim().isLength({min:5,max: 100}).withMessage('must be at least 100 chars long'),
    body('title').trim().isLength({min:5,max:30}).withMessage('must be at least 30 chars long'),
    body('content').trim().isLength({min:5,max:1000}).withMessage('must be at least 1000 chars long'),
    (req: Request, res: Response) => {

        const id = +req.params.id
        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        const updatePostId  = postsRepositories.updatePostId(id,title,content,shortDescription,bloggerId)

        const error = validationResult(req)

        if(!error.isEmpty() || updatePostId.status === 400 || updatePostId.status === 404){
            if(updatePostId.status === 404){
                res.send(404)
                return
            }
            const errorsMessages = error.array().map( err=>({message:err.msg, field:err.param}))
            if(updatePostId.status === 400){
                errorsMessages.push({ message: "non found bloggerId ", field: "bloggerId" })
            }
            return res.status(400).json({errorsMessages:errorsMessages})
        }
        res.send(204)
    })

ht_02_Router.delete('/api/posts/:id',
    authorizationMiddleware,
    (req: Request, res: Response) => {

    const postDeleteId = +req.params.id
    const statusRemovePostId = postsRepositories.deletePostId(postDeleteId)

    if(statusRemovePostId){
        res.send(204)
        return
    }
    res.send(404)
    return;
})

