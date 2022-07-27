import {commentsCollection} from "../db";

export const commentsRepositories04 ={
    async getComments(idComments:string){
        await commentsCollection.find({id:idComments})
    },
    async getCommentsPost(idComments:string,pageNumber:number,pageSize:number){
        let skipCount = (pageNumber-1) * pageSize
        const allCommentsPost = await commentsCollection.find({id:idComments}).toArray()
        const commentsPost =await commentsCollection
            .find({id:idComments})
            .skip(skipCount)
            .limit(pageSize)
            .toArray()
        return {
            "pagesCount": Math.ceil( allCommentsPost.length / pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": allCommentsPost.length,
            "items": commentsPost
        }
    },
    async createCommentsPost(idComments:string,content:string,token:string){
        const id = new Date().toString()
        const newCommentPost ={
            "id": id,
            "content": content,
            "userId": token,            // need fix
            "userLogin": token,         // need fix
            "addedAt": new Date().toString()
        }
        await commentsCollection.insertOne(newCommentPost)
        return newCommentPost
    },
    async updateComments(content:string,idComments:string){
        await commentsCollection.updateOne({id:idComments},{content:content})
    },
    async deleteComments(idComments:string){
        await commentsCollection.deleteOne({id:idComments})
    }
}
