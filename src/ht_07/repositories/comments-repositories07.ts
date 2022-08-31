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
        const likes = await likesCollectionModel.findOne({id:idComments})

        const likesCount = likes.newestLikes?.filter(l=>l.myStatus !== "Like")?.length || 0
        const dislikesCount = likes.newestLikes?.filter(l=>l.myStatus !== "Dislike")?.length || 0
        return {
            "id":commentsId.id,
            "content": commentsId.content,
            "userId": commentsId.userId,
            "userLogin": commentsId.userLogin,
            "addedAt": commentsId.addedAt,
            likesInfo: {
                "likesCount": likesCount,
                "dislikesCount": dislikesCount,
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

        const items =  await Promise.all([convertPostsComments(commentsPost)])

        return {
            "pagesCount": Math.ceil( allCommentsPost.length / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": allCommentsPost.length,
            "items": items.flat(1)
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
    async updateCommentsLikeStatus(idComments:string,likeStatus:string,userId:string,login:string){
        const likesCollection = await likesCollectionModel.findOne({id:idComments}).lean()
        const likesPost = likesCollection.newestLikes.find(user=>user.userId ===userId)
        if(!likesPost){
            await likesCollectionModel.updateOne({id:idComments},
                { $push: { newestLikes: {
                            addedAt: new Date().toISOString(),
                            userId: userId,
                            login: login,
                            myStatus: likeStatus
                        } } }
            )
        }else{
            await likesCollectionModel.updateOne({id:idComments},
                { $set:
                        { newestLikes:
                                {
                                    addedAt: new Date().toISOString(),
                                    userId: userId,
                                    login: login,
                                    myStatus: likeStatus
                                }}}
            )
        }
        return
    }
    async deleteComments(idComments:string){
        return  await commentsCollectionModel.deleteOne({id:idComments})
    }
}


