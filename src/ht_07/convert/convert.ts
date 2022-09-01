import {BloggerMongoDBType, CommentsType } from "../types"
import {LikesRepositories} from "../repositories/likes-repositories";
import {likesCollectionModel} from "../db";
import {byDate} from "../controller/controller-posts";
import {userIdGlobal} from "../../validation/validation";

// export type BloggerMongoType = {
//     id:string
//     name:string
//     youtubeUrl:string
// }
export type BloggerPostsMongoType = {
    "id": string
    "title": string
    "shortDescription": string
    "content": string
    "bloggerId": string
    "bloggerName": string
    addedAt:string
}
type PostsCommentsMongoType= {
    "id": string
    "content":string
    "userId": string
    "userLogin": string
    "addedAt": string
}
export const convertBloggers = (bloggersMongo:Array<BloggerMongoDBType>) =>{
    return bloggersMongo.map(b =>(convertBlogger(b)))
}
export const convertBlogger = (bloggerMongo:BloggerMongoDBType) => {
    return {
        id:bloggerMongo.id,
        name:bloggerMongo.name,
        youtubeUrl:bloggerMongo.youtubeUrl
    }
}
export const convertBloggerId = (bloggerId:BloggerMongoDBType) =>{
    return  {
        id:bloggerId.id,
        name:bloggerId.name,
        youtubeUrl:bloggerId.youtubeUrl
    }
}

export const convertBloggersPosts = async (bloggersPostsMongo:Array<BloggerPostsMongoType>,userId:string) =>{
    return Promise.all( bloggersPostsMongo.map(b =>(convertBloggerPost(b,userId))))
}

export const convertBloggerPost = async (bloggerPostMongo:BloggerPostsMongoType,userId:string) =>{

    const lastLikes = await likesCollectionModel.findOne({id:bloggerPostMongo.id})
    const like =  lastLikes.newestLikes.filter(l=>l.myStatus !== "Dislike").filter(l=>l.myStatus !== "None").length
    const dislike =  lastLikes.newestLikes.filter(l=>l.myStatus !== "Like").filter(l=>l.myStatus !== "None").length

    const newestLikes = lastLikes.newestLikes
        .filter(l=>l.myStatus !== "Dislike")
        .filter(l=>l.myStatus !== "None")
        .map(l=>({
            "addedAt": l.addedAt,
            "userId": l.userId,
            "login":l.login,
        }))
        .sort(byDate)
        .slice(0, 3)

    let myStatus =  "None"
     if(userId){
         myStatus = lastLikes.newestLikes?.find(s=>s.userId === userId)?.myStatus || "None"
     }
    return {
        "id": bloggerPostMongo.id,
        "title": bloggerPostMongo.title,
        "shortDescription": bloggerPostMongo.shortDescription,
        "content": bloggerPostMongo.content,
        "bloggerId": bloggerPostMongo.bloggerId,
        "bloggerName": bloggerPostMongo.bloggerName,
        addedAt:bloggerPostMongo.addedAt,
        "extendedLikesInfo": {
            "likesCount": like,
            "dislikesCount": dislike,
            "myStatus": myStatus ,
            "newestLikes": newestLikes
        }
    }
}
export const convertBloggerPostCreate = async (bloggerPostMongo:BloggerPostsMongoType) =>{
    return {
        "id": bloggerPostMongo.id,
        "title": bloggerPostMongo.title,
        "shortDescription": bloggerPostMongo.shortDescription,
        "content": bloggerPostMongo.content,
        "bloggerId": bloggerPostMongo.bloggerId,
        "bloggerName": bloggerPostMongo.bloggerName,
        addedAt:bloggerPostMongo.addedAt,
        "extendedLikesInfo": {
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": "None",
            "newestLikes":[]
        }
    }
}
export const convertPostsComments = async (postsCommentsMongo:Array<CommentsType>,userId:string) =>{
    return Promise.all(postsCommentsMongo.map(p =>(convertPostsMapComments(p,userId))))
}
export const convertPostsMapComments = async (postsComments:any,userId:string)=>{
    const lastLikes = await likesCollectionModel.findOne({id:postsComments.id}).lean()
    const like =  lastLikes.newestLikes.filter(l=>l.myStatus !== "Dislike").filter(l=>l.myStatus !== "None").length
    const dislike =  lastLikes.newestLikes.filter(l=>l.myStatus !== "Like").filter(l=>l.myStatus !== "None").length

    let myStatus =  "None"
    if(userId){
        myStatus = lastLikes.newestLikes?.find(s=>s.userId === userId)?.myStatus || "None"
    }
    return {
        "id": postsComments.id,
        "content": postsComments.content,
        "userId": postsComments.userId,
        "userLogin":postsComments.userLogin,
        "addedAt": postsComments.addedAt,
        "likesInfo": {
            "likesCount": like,
            "dislikesCount": dislike,
            "myStatus": myStatus
        }
    }
}



