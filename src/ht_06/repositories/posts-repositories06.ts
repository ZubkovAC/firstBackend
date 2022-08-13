import {bloggersCollection06, postsCollection06} from "../db";
import {convertBloggerPost, convertBloggersPosts} from "../convert/convert";
import { v4 as uuidv4 } from 'uuid'
import {PostsType} from "../types";

export const postsRepositories06 ={
    async findPosts(pageNumber:number, pageSize:number){
        let skipCount = (pageNumber-1) * pageSize
        const totalCount = await postsCollection06.countDocuments()
        const postsMongo:PostsType[] = await postsCollection06.find({}).skip(skipCount).limit(pageSize).lean()
        return {
            totalCount : totalCount,
            pageSize : pageSize,
            page:pageNumber,
            pagesCount: Math.ceil(totalCount/ pageSize),
            items: convertBloggersPosts(postsMongo)
        }
    },
    async findPostId(postId:string)  {
        const post:PostsType = await postsCollection06.findOne({id:postId}).lean()
        if(post){
            return {post:convertBloggerPost(post),status:true}
        }
        return {status:false}
    },
    async deletePostId(postId:string){
        const res = await postsCollection06.deleteOne({id:postId})
        return res.deletedCount === 1
    },
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        let searchBlogger = await bloggersCollection06.findOne({id:bloggerId})
        if(!searchBlogger && searchBlogger === null){
            return {errorsMessages:{ message: "non found bloggerId ", field: "bloggerId" } ,status:400}
        }
        const newPost = {
            "id": uuidv4(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": searchBlogger.name
        }
        await postsCollection06.insertMany([newPost])
        return {newPost:convertBloggerPost(newPost) ,status:201}
    },

    async updatePostId(postId:string,title:string,content:string,shortDescription:string,bloggerId:string){
        let searchBlogger = await bloggersCollection06.findOne({id:bloggerId})
            await postsCollection06.updateOne({id:postId},
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
}

