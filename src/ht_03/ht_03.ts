import {NextFunction, Request, Response, Router} from "express";
import {authorizationMiddleware03} from "./authorization-middleware/authorization-middleware03";
import {
    validationContent, validationError, validationErrorCreatePosts, validationErrorUpdatePosts,
    validationName15,
    validationShortDescription,
    validationTitle,
    validationYoutubeUrl
} from "./validation/validation";
import {bloggersServiceDb03} from "./service/service-bloggers";
import {postsService03} from "./service/service-posts";


export const ht_03_Router = Router({})

let count = 0

const countResponse = (req: Request, res: Response ,next: NextFunction)=>{
    count++
    next()
}

ht_03_Router.get('/api/bloggers',
    countResponse,
    async (req: Request, res: Response) => {
    const bloggers = await bloggersServiceDb03.findBloggers()
    console.log(count)
    res.status(200).send(bloggers)
})

ht_03_Router.get('/api/bloggers/:id',async (req: Request, res: Response) => {
    const bloggers = await bloggersServiceDb03.findBloggerId(+req.params.id)
    if(bloggers){
        res.status(200).send(bloggers)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return
})

ht_03_Router.post('/api/bloggers',
    authorizationMiddleware03,
    validationName15,
    validationYoutubeUrl,
    async (req: Request, res: Response) => {
        validationError(req,res)
        let name = req.body.name.trim()
        let youtubeUrl = req.body.youtubeUrl.trim()
        const createBlogger = await bloggersServiceDb03.createBlogger(name,youtubeUrl)
        res.status(201).send(createBlogger.newVideo)
    })

ht_03_Router.put('/api/bloggers/:id',
    authorizationMiddleware03,
    validationName15,
    validationYoutubeUrl,
    async (req: Request, res: Response) => {
        validationError(req,res)
        const id = +req.params.id
        const newName = req.body.name
        const newYoutubeUrl = req.body.youtubeUrl
        const updateBlogger = await bloggersServiceDb03.updateBlogger(id,newName,newYoutubeUrl)
        if(updateBlogger.error === 204){
            res.status(204).send(updateBlogger.videoId)
            return
        }
        if(updateBlogger.error === 404){
            res.send(404)
            return
        }
    })

ht_03_Router.delete('/api/bloggers/:id',
    authorizationMiddleware03,
    async (req: Request, res: Response) => {
    const bloggerDeleteId = +req.params.id
    const removeBlogger = await bloggersServiceDb03.removeBloggerId(bloggerDeleteId)
    if(removeBlogger){
        res.send(204)
        return
    }
    res.send(404)
    return;
})

ht_03_Router.get('/api/posts',
    async (req: Request, res: Response) => {
    const posts = await postsService03.findPosts()
    res.status(200).send(posts)
})
ht_03_Router.get('/api/posts/:id',
    async(req: Request, res: Response) => {
    const id = +req.params.id
    const post = await postsService03.findPostId(id)
    if(post.status){
        res.status(200).send(post.post)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return;
})

ht_03_Router.post('/api/posts',
    authorizationMiddleware03,
    validationShortDescription,
    validationTitle,
    validationContent,
    async (req: Request, res: Response) => {

        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        const newPost = await postsService03.createPost(title,shortDescription,content,bloggerId)
        validationErrorCreatePosts(req,res,newPost)
        res.status(newPost.status).send(newPost.newVideo)
    })

ht_03_Router.put('/api/posts/:id',
    authorizationMiddleware03,
    validationShortDescription,
    validationTitle,
    validationContent,
    async (req: Request, res: Response) => {

        const id = +req.params.id
        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        const updatePostId  = await postsService03.updatePostId(id,title,content,shortDescription,bloggerId)
        validationErrorUpdatePosts(req,res,updatePostId)
        res.send(204)
    })

ht_03_Router.delete('/api/posts/:id',
    authorizationMiddleware03,
    async (req: Request, res: Response) => {
    const postDeleteId = +req.params.id
    const statusRemovePostId = await postsService03.deletePostId(postDeleteId)
    if(statusRemovePostId){
        res.send(204)
        return
    }
    res.send(404)
    return;
})
