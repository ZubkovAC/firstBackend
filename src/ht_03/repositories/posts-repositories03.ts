import {bloggers} from "./bloggers-repositories03";
import {bloggersCollection, postsCollection} from "../db";
import {convertBloggerPost, convertBloggersPosts} from "../convert/convert";

let posts =[
    {
        "id": 1,
        "title": "newMessage",
        "shortDescription": "new group 28 may",
        "content": "sale 20%",
        "bloggerId": 1,
        "bloggerName": "Dumich"
    },{
        "id": 2,
        "title": "new Video",
        "shortDescription": "react 18",
        "content": "new hooks",
        "bloggerId": 2,
        "bloggerName": "it-kamasutra"
    },{
        "id": 3,
        "title": "next js",
        "shortDescription": "one video project next js",
        "content": "next js start-end",
        "bloggerId": 3,
        "bloggerName": "UlbiTV"
    },
]

export const postsRepositories03 ={
    async findPosts(pageNumber:number, pageSize:number){
        let skipCount = (pageNumber-1) * pageSize
        const totalCount = await postsCollection.countDocuments()
        const postsMongo = await postsCollection.find({}).skip(skipCount).limit(pageSize).toArray()
        return {
            totalCount : totalCount,
            pageSize : pageSize,
            page:pageNumber,
            pagesCount: Math.ceil(totalCount/ pageSize),
            items: convertBloggersPosts(postsMongo)
        }
    },
    async findPostId(postId:number){
        const post = await postsCollection.findOne({id:postId})
        if(post){
            return {post:convertBloggerPost(post),status:true}
        }
        return {status:false}
    },
    async deletePostId(postId:number){
        const res = await postsCollection.deleteOne({id:postId})
        return res.deletedCount === 1
    },
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:number){
        let searchBlogger = await bloggersCollection.findOne({id:bloggerId})
        if(!searchBlogger && searchBlogger === null){
            return {errorsMessages:{ message: "non found bloggerId ", field: "bloggerId" } ,status:400}
        }
        const newPost = {
            "id": + new Date(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": searchBlogger.name
        }
        await postsCollection.insertOne(newPost)
        return {newPost:convertBloggerPost(newPost) ,status:201}
    },

    async updatePostId(postId:number,title:string,content:string,shortDescription:string,bloggerId:number){
        let searchPost = await postsCollection.findOne({id:postId})
        let searchBlogger = await bloggersCollection.findOne({id:bloggerId})
        console.log("mongo",searchPost,searchBlogger)
        const error = {"errorsMessages": [],status:400}
        if(searchBlogger === null ){
            error.errorsMessages.push({ message: "non found bloggerId ", field: "bloggerId" })
        }
        if(searchPost === null){
            error.errorsMessages.push({ message: "non found post ", field: "post" })
        }
        if(searchBlogger === null || searchPost === null){
            return error
        }
        if(searchPost){
            await postsCollection.updateOne({id:postId},
                { $set:
                        {   id:postId,
                            title:title,
                            shortDescription:shortDescription,
                            content:content,
                            bloggerId:bloggerId,
                            bloggerName:searchBlogger.name
                        }})
            return {status:204}
        }
        return {status:404}
    }
}
