import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {userIdGlobal, validationErrorCreatePostsv2} from "../../validation/validation";
import {PostsService} from "../service/service-posts";
import {CommentsService} from "../service/service-comments";
import {likesCollectionModel} from "../db";
var jwt = require('jsonwebtoken')


const pageNumber = (pageNum :string) => pageNum ? +pageNum : 1
const pageSize = (pageSiz :string) => pageSiz ? +pageSiz : 10
const searchNameTerm = (searchName :string) => searchName ? searchName : ''

export function byDate (a, b) {
    if (a.addedAt < b.addedAt) return 1;
    if (a.addedAt > b.addedAt) return -1;
    return 0;
}

@injectable()
export class PostsController{
    constructor(
        @inject(PostsService)
        protected postsService:PostsService,
        protected commentsService:CommentsService
    ) {}

    async getPosts (req: Request, res: Response){
        const token = req.headers.authorization?.split(" ")[1]
        let userId = ''
        if(token){
            userId = jwt.verify(token,process.env.SECRET_KEY).userId
        }
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const posts = await this.postsService.findPosts(pageN,pageS ,userId)
        res.status(200).send(posts)
        return
    }

    async getPostId (req: Request, res: Response){
        const id = req.params.id
        const token = req.headers.authorization?.split(" ")[1]
        let userId = ''
        if(token){
            userId = jwt.verify(token,process.env.SECRET_KEY).userId
        }
        const post = await this.postsService.findPostId(id,userId)
        const likes  = await likesCollectionModel.findOne({id:id},"-newestLikes._id").lean()

        let likeCount = 0
        let dislikeCount = 0

        for (let x =0; likes.newestLikes.length > x; x++){
            if(likes.newestLikes[x].myStatus === "Like" ){
                likeCount += 1
            }
            if(likes.newestLikes[x].myStatus === "Dislike" ){
                dislikeCount += 1
            }
        }
        let myStatus
        if(token){
            const {userId}= await jwt.verify(token,process.env.SECRET_KEY)
            myStatus = likes.newestLikes?.find(l=>l.userId === userId)?.myStatus
        }
        let newestLikes = likes.newestLikes
            .filter(l=>l.myStatus !== "Dislike")
            .filter(l=>l.myStatus !== "None")
            .map(s=>({"addedAt": s.addedAt,
            "userId": s.userId,
            "login": s.login}))
            .sort(byDate)
            .slice(0, 3)

        const extendedLikesInfo ={
            "likesCount": likeCount,
            "dislikesCount": dislikeCount,
            "myStatus": myStatus || "None",
            "newestLikes": newestLikes
        }
        res.status(200).send({...post,extendedLikesInfo})
        return
    }


    async getPostsIdComments(req: Request, res: Response){
        const id = req.params.id
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const commentsPost = await this.commentsService.getCommentsPost(id,pageN,pageS)

        res.status(200).send(commentsPost)
        return;

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
        res.status(201).send(newPost)
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
    async likeStatus(req: Request, res: Response){
        const likeStatus = req.body.likeStatus
        const token = req.headers.authorization.split(" ")[1]
        const {email,login,userId } = await jwt.verify(token,process.env.SECRET_KEY)
        const likesCollection = await likesCollectionModel.findOne({id:req.params.id}).lean()
        const likesPost = likesCollection.newestLikes.find(user=>user.userId === userId)

            if(!likesPost){ // delete?
                await likesCollectionModel.updateOne({id:req.params.id },
                    { $push:
                                { newestLikes: {
                                    addedAt: new Date().toISOString(),
                                    userId: userId,
                                    login: login,
                                    myStatus: likeStatus
                                    }
                                }
                    }
                )
            }else{
                await likesCollectionModel.updateOne({$and:[{id:req.params.id}, {"newestLikes.userId":userId }]},
                    { $set:
                                {"newestLikes.$":{
                                    addedAt: new Date().toISOString(),
                                    userId: userId,
                                    login: login,
                                    myStatus: likeStatus
                                }
                        }}
                )
            }
        res.send(204)
        return
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
