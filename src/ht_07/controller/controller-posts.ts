import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {validationErrorCreatePostsv2} from "../../validation/validation";
import {PostsService} from "../service/service-posts";
import {CommentsService} from "../service/service-comments";



const pageNumber = (pageNum :string) => pageNum ? +pageNum : 1
const pageSize = (pageSiz :string) => pageSiz ? +pageSiz : 10
const searchNameTerm = (searchName :string) => searchName ? searchName : ''

@injectable()
export class PostsController{
    constructor(
        @inject(PostsService)
        protected postsService:PostsService,
        protected commentsService:CommentsService
    ) {}

    async getPosts (req: Request, res: Response){
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const posts = await this.postsService.findPosts(pageN,pageS)
        res.status(200).send(posts)
        return
    }

    async getPostId (req: Request, res: Response){
        const id = req.params.id
        const post = await this.postsService.findPostId(id)
        if(post.status){
            res.status(200).send(post.post)
            return
        }
        res.status(404).send("If video for passed id doesn't exist")
        return;
    }
    async getPostsIdComments(req: Request, res: Response){
        const id = req.params.id
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const post = await this.postsService.findPostId(id)
        if(post.status){
            const commentsPost = await this.commentsService.getCommentsPost(id,pageN,pageS)
            res.status(200).send(commentsPost)
            return;
        }
        res.send(404)
    }
    async createPostsIdComments(req: Request, res: Response){
        let content = req.body.content.trim()
        const token = req.headers.authorization
        const postId = req.params.id
        const newComments = await this.commentsService.createCommentsPost(postId,content,token )
        res.status(201).send(newComments)
    }
    async createPosts(req: Request, res: Response){
        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        const newPost = await this.postsService.createPost(title,shortDescription,content,bloggerId)
        validationErrorCreatePostsv2(req,res,newPost)
        res.status(newPost.status).send(newPost.newPost)
    }
    async updatePostId(req: Request, res: Response){
        const postId = req.params.id
        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        const updatePostId  = await this.postsService.updatePostId(postId,title,content,shortDescription,bloggerId)
        if(updatePostId.status === 204){
            res.send(204)
        }    else {
            res.send(404)
        }
    }
    async deletePostId(req: Request, res: Response){
        const postDeleteId = req.params.id
        const statusRemovePostId = await this.postsService.deletePostId(postDeleteId)
        if(statusRemovePostId){
            res.send(204)
            return
        }
        res.send(404)
        return;
    }
}
