import {Request, Response, Router} from "express";
import {postsService04} from "../service/service-posts";
import {pageNumber, pageSize} from "../function";
import {
    validationBloggerId,
    validationContent,
    validationContent20_300,
    validationErrorCreatePosts, validationErrorCreatePostsv2,
    validationErrorUpdatePosts,
    validationPostId,
    validationShortDescription,
    validationTitle,
    validatorPostIdComments
} from "../../validation/validation";
import {serviceComments04} from "../service/service-comments";
import {authorizationMiddleware06} from "../authorization-middleware06/authorization-middleware06";
import {authorizationMiddleware03} from "../authorization-middleware06/authorization-middleware03";

export const RouterPosts07 = Router({})

RouterPosts07.get('',
    async (req: Request, res: Response) => {
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const posts = await postsService04.findPosts(pageN,pageS)
        res.status(200).send(posts)
    })
RouterPosts07.get('/:id',
    async(req: Request, res: Response) => {
        const id = req.params.id
        const post = await postsService04.findPostId(id)
        if(post.status){
            res.status(200).send(post.post)
            return
        }
        res.status(404).send("If video for passed id doesn't exist")
        return;
    })
RouterPosts07.get('/:id/comments',
    validatorPostIdComments,
    async(req: Request, res: Response) => {
        const id = req.params.id
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const post = await postsService04.findPostId(id)
        console.log("post",post)
        if(post.status){
            const commentsPost = await serviceComments04.getCommentsPost(id,pageN,pageS)
            // need validation + fix error ( 404, 400 )
            console.log(commentsPost)
            res.status(200).send(commentsPost)
            return;
        }
        res.send(404)
    })
RouterPosts07.post('/:id/comments',
    authorizationMiddleware06,
    validationContent20_300,
    validationErrorCreatePosts,
    validationPostId,
    validationErrorUpdatePosts,
    async (req: Request, res: Response) => {
        let content = req.body.content.trim()
        const token = req.headers.authorization
        const postId = req.params.id
        const newComments = await serviceComments04.createCommentsPost(postId,content,token )
        // need fix error (401 , 400 , token )
        console.log("newComments",newComments)
        res.status(201).send(newComments)
    })
RouterPosts07.post('/',
    authorizationMiddleware03,
    validationShortDescription,
    validationTitle,
    validationContent,
    validationErrorCreatePosts,
    async (req: Request, res: Response) => {
        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        const newPost = await postsService04.createPost(title,shortDescription,content,bloggerId)
        validationErrorCreatePostsv2(req,res,newPost)
        res.status(newPost.status).send(newPost.newPost)
    })
RouterPosts07.put('/:id',
    authorizationMiddleware03,
    validationShortDescription,
    validationTitle,
    validationContent,
    validationPostId,
    validationBloggerId,
    validationErrorUpdatePosts,
    async (req: Request, res: Response) => {
        const postId = req.params.id
        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        console.log('put post',postId,bloggerId)
        const updatePostId  = await postsService04.updatePostId(postId,title,content,shortDescription,bloggerId)
        if(updatePostId.status === 204){
            res.send(204)
        }    else {
            res.send(404)
        }
    })
RouterPosts07.delete('/:id',
    authorizationMiddleware03,
    async (req: Request, res: Response) => {
        const postDeleteId = req.params.id
        const statusRemovePostId = await postsService04.deletePostId(postDeleteId)
        if(statusRemovePostId){
            res.send(204)
            return
        }
        res.send(404)
        return;
    })
