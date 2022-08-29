import {CommentsRepositories} from "../repositories/comments-repositories07";
import {inject, injectable} from "inversify";
var jwt = require('jsonwebtoken')
import {likesCollectionModel, userRegistrationModel} from "../db";
import {v4 as uuidv4} from "uuid";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsRepositories) protected commentsRepositories:CommentsRepositories) {
    }
    async getComments(idComments:string){
       return await this.commentsRepositories.getComments(idComments)
    }
    async getCommentsPost(idComments:string,pageNumber:number,pageSize:number){
      return  await this.commentsRepositories.getCommentsPost(idComments,pageNumber,pageSize)
    }
    async createCommentsPost(idComments:string,content:string,token:string){
        const parse = await jwt.verify(token.split(" ")[1],process.env.SECRET_KEY)
        const userId = await userRegistrationModel.findOne({"accountData.login":parse.login})
        const id = uuidv4()
        const newCommentPost ={
            idPostComment: idComments ,
            id: id ,
            content: content,
            userId: userId.accountData.userId,
            userLogin: userId.accountData.login,
            addedAt: new Date().toISOString()
        }
        await this.commentsRepositories.createCommentsPost(newCommentPost)
        await likesCollectionModel.insertMany([{
                id:id,
                newestLikes: []
        }])
        return{
            id:id,
            content: newCommentPost.content,
            userId: newCommentPost.userId,
            userLogin: newCommentPost.userLogin,
            addedAt: newCommentPost.addedAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            }
        }
    }
    async updateComments(idComments:string,content:string){
       return await this.commentsRepositories.updateComments(idComments,content)
    }
    async updateCommentsLikeStatus(idComments:string,likeStatus:string,userId:string, login:string){
       return await this.commentsRepositories.updateCommentsLikeStatus(idComments,likeStatus,userId,login)
    }
    async deleteComments(idComments:string){
       return await this.commentsRepositories.deleteComments(idComments)
    }
}