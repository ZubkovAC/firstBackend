import {Request, Response, Router} from "express";
import {bloggersRepositories} from "./repositories/bloggers-repositories";
import {postsRepositories} from "./repositories/posts-repositories";

export const bloggers_01_Router = Router({})

bloggers_01_Router.get('/api/bloggers',(req: Request, res: Response) => {
    const bloggers = bloggersRepositories.findBloggers()
    res.status(200).send(bloggers)
})

bloggers_01_Router.get('/api/bloggers/:id',(req: Request, res: Response) => {

    const bloggers = bloggersRepositories.findBloggerId(+req.params.id)
    if(bloggers){
        res.status(200).send(bloggers)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return
})

bloggers_01_Router.post('/api/bloggers',(req: Request, res: Response) => {

    let name = req.body.name?.trim() ? req.body.name.trim() : ''
    let youtubeUrl = req.body.youtubeUrl.trim()
    const createBlogger = bloggersRepositories.createBlogger(name,youtubeUrl)
    if(createBlogger.error){
        res.status(400).send({errorsMessages: createBlogger.errorsMessages})
        return
    }
    res.status(201).send(createBlogger.newVideo)
})



bloggers_01_Router.put('/api/bloggers/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    const newName = req.body.name?.trim() ?  req.body.name.trim() : ''
    const newYoutubeUrl = req.body.youtubeUrl.trim()
    const updateBlogger = bloggersRepositories.updateBlogger(id,newName,newYoutubeUrl)
    if(updateBlogger.error === 204){
        res.status(204).send(updateBlogger.videoId)
        return
    }
    if(updateBlogger.error === 404){
        res.send(404)
        return
    }
    if(updateBlogger.error === 400){
        res.status(400).send({errorsMessages:updateBlogger.errorsMessages})
        return
    }
})

bloggers_01_Router.delete('/api/bloggers/:id',(req: Request, res: Response) => {
    const bloggerDeleteId = +req.params.id
    const removeBlogger = bloggersRepositories.removeBloggerId(bloggerDeleteId)
    if(removeBlogger){
        res.send(204)
        return
    }
    res.send(404)
    return;
})


bloggers_01_Router.get('/api/posts',(req: Request, res: Response) => {
   const posts =  postsRepositories.findPosts()
    res.status(200).send(posts)
})
bloggers_01_Router.get('/api/posts/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    const post = postsRepositories.findPostId(id)
    if(post.status){
        res.status(200).send(post.post)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return;
})

bloggers_01_Router.post('/api/posts',(req: Request, res: Response) => {

    let shortDescription = req.body.shortDescription ? req.body.shortDescription?.trim() : ''
    let title = req.body.title ? req.body.title?.trim() : ''
    let content = req.body.content ? req.body.content?.trim() : ''
    let bloggerId =req.body.bloggerId
    const newPost = postsRepositories.createPost(title,shortDescription,content,bloggerId)

    if(newPost.status === 400){
        res.status(newPost.status).send(newPost.errorsMessages)
        return
    }
    res.status(newPost.status).send(newPost.newVideo)
})



bloggers_01_Router.put('/api/posts/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    let shortDescription = req.body.shortDescription ? req.body.shortDescription?.trim() : ''
    let title = req.body.title ? req.body.title?.trim() : ''
    let content = req.body.content ? req.body.content?.trim() : ''
    let bloggerId = req.body.bloggerId
    const updatePostId = postsRepositories.updatePostId(id,title,content,shortDescription,bloggerId)
    if(updatePostId.status === 400){
        res.status(updatePostId.status).send(updatePostId.errorsMessages)
        return
    }if(updatePostId.status === 204){
        res.send(updatePostId.status)
        return
    }if(updatePostId.status === 404){
        res.send(updatePostId.status)
        return
    }
})

bloggers_01_Router.delete('/api/posts/:id',(req: Request, res: Response) => {
    const postDeleteId = +req.params.id
    const statusRemovePostId = postsRepositories.deletePostId(postDeleteId)

    if(statusRemovePostId){
        res.send(204)
        return
    }
    res.send(404)
    return;
})
