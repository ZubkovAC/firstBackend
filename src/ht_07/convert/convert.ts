import {BloggerMongoDBType, CommentsType } from "../types"
import {LikesRepositories} from "../repositories/likes-repositories";
import {likesCollectionModel} from "../db";

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

export const convertBloggersPosts = async (bloggersPostsMongo:Array<BloggerPostsMongoType>) =>{
    return Promise.all( bloggersPostsMongo.map(b =>(convertBloggerPost(b))))

    // const promises = bloggersPostsMongo.map(async (b) => {
    //     try {
    //         const res = await convertBloggerPost(b)
    //         return res
    //     } catch (e) {
    //         return "a"
    //     }
    //     console.log("promises",promises)
    //     const res =await Promise.all(promises);
    //     console.log("res",res)
    //     return res
    //     }
    // )

}

export const convertBloggerPost = async (bloggerPostMongo:BloggerPostsMongoType) =>{
    console.log("bloggerPostMongo",bloggerPostMongo)
    const lastLikes = await likesCollectionModel.findOne({id:bloggerPostMongo.id}).lean()
    const like =  lastLikes.newestLikes.filter(l=>l.myStatus !== "Like")
    const dislike =  lastLikes.newestLikes.filter(l=>l.myStatus !== "Dislike")

    // console.log("lastLikes",{
    //     "id": bloggerPostMongo.id,
    //     "title": bloggerPostMongo.title,
    //     "shortDescription": bloggerPostMongo.shortDescription,
    //     "content": bloggerPostMongo.content,
    //     "bloggerId": bloggerPostMongo.bloggerId,
    //     "bloggerName": bloggerPostMongo.bloggerName,
    //     addedAt:bloggerPostMongo.addedAt,
    //     "extendedLikesInfo": {
    //         "likesCount": like.length,
    //         "dislikesCount": dislike.length,
    //         "myStatus": "None",
    //         "newestLikes": like
    //     }
    // })
    return {
        "id": bloggerPostMongo.id,
        "title": bloggerPostMongo.title,
        "shortDescription": bloggerPostMongo.shortDescription,
        "content": bloggerPostMongo.content,
        "bloggerId": bloggerPostMongo.bloggerId,
        "bloggerName": bloggerPostMongo.bloggerName,
        addedAt:bloggerPostMongo.addedAt,
        "extendedLikesInfo": {
            "likesCount": like.length,
            "dislikesCount": dislike.length,
            "myStatus": "None",
            "newestLikes": like
        }
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

