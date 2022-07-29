import {commentsCollection, secret, usersCollection} from "../db";
import { v4 as uuidv4 } from 'uuid'
import {convertPostsComments} from "../convert/convert";
// import jwt from "jsonwebtoken";
var jwt = require('jsonwebtoken')

export const commentsRepositories04 ={
    async getComments(idComments:string){
        const commentsId = await commentsCollection.findOne({id:idComments})
        console.log("idComments",idComments)
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
        const allCommentsPost = await commentsCollection.find({idPostComment:idComments}).toArray()
        const commentsPost = await commentsCollection
            .find({idPostComment:idComments})
            .skip(skipCount)
            .limit(pageSize)
            .toArray()
        return {
            "pagesCount": Math.ceil( allCommentsPost.length / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": allCommentsPost.length,
            "items": convertPostsComments(commentsPost)
        }
    },
    async createCommentsPost(idPosts:string,content:string,token:string){
        const parse = jwt.verify(token.split(" ")[1],secret.key)
        const userId = await usersCollection.findOne({id:parse.id})
        console.log("idPosts",idPosts)
        // const searchCommentsPost = await usersCollection.findOne({idPost:parse.id})
        const newCommentPost ={
            idPostComment: idPosts ,
            "id": uuidv4(),
            "content": content,
            "userId": parse.id,
            "userLogin": userId.login,
            "addedAt": new Date().toISOString()
        }
        console.log("newCommentPost",newCommentPost)
        await commentsCollection.insertOne(newCommentPost)
        return {
            "id":newCommentPost.id,
            "content": newCommentPost.content,
            "userId": newCommentPost.userId,
            "userLogin": newCommentPost.userLogin,
            "addedAt": newCommentPost.addedAt
        }
    },
    async updateComments(idComments:string,content:string){
        console.log('update', idComments,content)
        const res = await commentsCollection.updateOne({id:idComments},{ $set:{content:content}})
        return res.matchedCount===1
    },
    async deleteComments(idComments:string){
        await commentsCollection.deleteOne({id:idComments})
    }
}
