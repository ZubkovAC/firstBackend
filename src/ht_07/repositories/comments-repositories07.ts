import {commentsCollectionModel, likesCollectionModel, userRegistrationModel} from "../db";
import { v4 as uuidv4 } from 'uuid'
import {convertPostsComments} from "../convert/convert";
import {CommentsType} from "../types";
import {injectable} from "inversify";

export type CommentsCollectionType = {
    idPostComment: string,
        id: string
        content: string
        userId: string
        userLogin: string
        addedAt: string}


@injectable()
export class CommentsRepositories{
    async getComments(idComments:string){
        const commentsId = await commentsCollectionModel.findOne({id:idComments})
        const likes = await likesCollectionModel.find({id:idComments}).lean()
        return {
            "id":commentsId.id,
            "content": commentsId.content,
            "userId": commentsId.userId,
            "userLogin": commentsId.userLogin,
            "addedAt": commentsId.addedAt,
            "extendedLikesInfo": {
                "likesCount": likes.length,
                "dislikesCount": 0,
                "myStatus": "None",
            }
        }
    }
    async getCommentsPost(idComments:string,pageNumber:number,pageSize:number){
        let skipCount = (pageNumber-1) * pageSize
        const allCommentsPost = await commentsCollectionModel.find({idPostComment:idComments}).lean()
        const commentsPost :Array<CommentsType> = await commentsCollectionModel
            .find({idPostComment:idComments})
            .skip(skipCount)
            .limit(pageSize)
            .lean()
        const likes = likesCollectionModel.find({idPostComment:idComments})

        return {
            "pagesCount": Math.ceil( allCommentsPost.length / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": allCommentsPost.length,
            "items": convertPostsComments(commentsPost)
        }
    }
    async createCommentsPost(newCommentPost:CommentsCollectionType){
        await commentsCollectionModel.insertMany([newCommentPost])
        return
    }
    async updateComments(idComments:string,content:string){
        const res = await commentsCollectionModel.updateOne({id:idComments},{ $set:{content:content}})
        return res.matchedCount===1
    }
    async deleteComments(idComments:string){
        return  await commentsCollectionModel.deleteOne({id:idComments})
    }
}


