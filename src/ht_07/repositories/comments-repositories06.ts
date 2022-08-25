import {commentsCollection06, registrationToken06} from "../db";
import { v4 as uuidv4 } from 'uuid'
import {convertPostsComments} from "../convert/convert";
import {CommentsType} from "../types";
// import jwt from "jsonwebtoken";
var jwt = require('jsonwebtoken')

export const commentsRepositories06 ={
    async getComments(idComments:string){
        const commentsId = await commentsCollection06.findOne({id:idComments})
        return {
            "id":commentsId.id,
            "content": commentsId.content,
            "userId": commentsId.userId,
            "userLogin": commentsId.userLogin,
            "addedAt": commentsId.addedAt
        }
    },
    async getCommentsPost(idComments:string,pageNumber:number,pageSize:number){
        let skipCount = (pageNumber-1) * pageSize
        const allCommentsPost = await commentsCollection06.find({idPostComment:idComments}).lean()
        const commentsPost :Array<CommentsType> = await commentsCollection06
            .find({idPostComment:idComments})
            .skip(skipCount)
            .limit(pageSize)
            .lean()
        return {
            "pagesCount": Math.ceil( allCommentsPost.length / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": allCommentsPost.length,
            "items": convertPostsComments(commentsPost)
        }
    },
    async createCommentsPost(idPosts:string,content:string,token:string){
        const parse = await jwt.verify(token.split(" ")[1],process.env.SECRET_KEY)
        const userId = await registrationToken06.findOne({"accountData.login":parse.login})
        // const searchCommentsPost = await usersCollection.findOne({idPost:parse.id})
        const newCommentPost ={
            idPostComment: idPosts ,
            "id": uuidv4(),
            "content": content,
            "userId": userId.accountData.userId,
            "userLogin": userId.accountData.login,
            "addedAt": new Date().toISOString()
        }
        await commentsCollection06.insertMany([newCommentPost])
        return {
            "id":newCommentPost.id,
            "content": newCommentPost.content,
            "userId": newCommentPost.userId,
            "userLogin": newCommentPost.userLogin,
            "addedAt": newCommentPost.addedAt
        }
    },
    async updateComments(idComments:string,content:string){
        const res = await commentsCollection06.updateOne({id:idComments},{ $set:{content:content}})
        return res.matchedCount===1
    },
    async deleteComments(idComments:string){
        return  await commentsCollection06.deleteOne({id:idComments})
    }
}


