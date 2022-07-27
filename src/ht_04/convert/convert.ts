type BloggerMongoType = {
    id:number
    name:string
    youtubeUrl:string
}
type BloggerPostsMongoType = {
    "id": number
    "title": string
    "shortDescription": string
    "content": string
    "bloggerId": number
    "bloggerName": string
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

