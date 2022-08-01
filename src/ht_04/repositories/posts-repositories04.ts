import {bloggersCollection, commentsCollection, deleteCommentsCollection, postsCollection} from "../db";
import {convertBloggerPost, convertBloggersPosts} from "../convert/convert";
import { v4 as uuidv4 } from 'uuid'

export const postsRepositories04 ={
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
    async findPostId(postId:string)  {
        const post = await postsCollection.findOne({id:postId})
        if(post){
            return {post:convertBloggerPost(post),status:true}
        }
        return {status:false}
    },
    async deletePostId(postId:string){
        const res = await postsCollection.deleteOne({id:postId})
        return res.deletedCount === 1
    },
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        let searchBlogger = await bloggersCollection.findOne({id:bloggerId})
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
        await postsCollection.insertOne(newPost)
        return {newPost:convertBloggerPost(newPost) ,status:201}
    },

    async updatePostId(postId:string,title:string,content:string,shortDescription:string,bloggerId:string){
        let searchBlogger = await bloggersCollection.findOne({id:bloggerId})
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
}

