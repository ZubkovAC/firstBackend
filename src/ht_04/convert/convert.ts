import {CommentsType} from "../db";

type BloggerMongoType = {
    id:string
    name:string
    youtubeUrl:string
}
type BloggerPostsMongoType = {
    "id": string
    "title": string
    "shortDescription": string
    "content": string
    "bloggerId": string
    "bloggerName": string
}
type PostsCommentsMongoType= {
    "id": string
    "content":string
    "userId": string
    "userLogin": string
    "addedAt": string
}
export const convertBloggers = (bloggersMongo:Array<BloggerMongoType>) =>{
    return bloggersMongo.map(b =>(convertBlogger(b)))
}
export const convertBlogger = (bloggerMongo:BloggerMongoType) => {
    return {
        id:bloggerMongo.id,
        name:bloggerMongo.name,
        youtubeUrl:bloggerMongo.youtubeUrl
    }
}
export const convertBloggerId = (bloggerId:BloggerMongoType) =>{
    return  {
        id:bloggerId.id,
        name:bloggerId.name,
        youtubeUrl:bloggerId.youtubeUrl
    }
}

export const convertBloggersPosts = (bloggersPostsMongo:Array<BloggerPostsMongoType>) =>{
    return bloggersPostsMongo.map(b =>(convertBloggerPost(b)))
}
export const convertBloggerPost = (bloggerPostMongo:BloggerPostsMongoType) =>{
    return {
        "id": bloggerPostMongo.id,
        "title": bloggerPostMongo.title,
        "shortDescription": bloggerPostMongo.shortDescription,
        "content": bloggerPostMongo.content,
        "bloggerId": bloggerPostMongo.bloggerId,
        "bloggerName": bloggerPostMongo.bloggerName,
    }
}
export const convertPostsComments = (postsCommentsMongo:Array<CommentsType>) =>{
    return postsCommentsMongo.map(p =>({
        "id": p.id,
        "content": p.content,
        "userId": p.userId,
        "userLogin": p.userLogin,
        "addedAt": p.addedAt
    }))
}

