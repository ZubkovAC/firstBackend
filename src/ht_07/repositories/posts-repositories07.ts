import {bloggersCollectionModel, postsCollectionModel} from "../db";
import {convertBloggerPost, convertBloggersPosts} from "../convert/convert";
import { v4 as uuidv4 } from 'uuid'
import {PostsType} from "../types";
import {injectable} from "inversify";

@injectable()
export class PostsRepositories {
    async findPosts(pageNumber:number, pageSize:number){
        let skipCount = (pageNumber-1) * pageSize
        const totalCount = await postsCollectionModel.countDocuments()
        const postsMongo:PostsType[] = await postsCollectionModel.find({}).skip(skipCount).limit(pageSize).lean()

        const items = await Promise.all([convertBloggersPosts(postsMongo)])
        console.log(5555,{
            totalCount : totalCount,
            pageSize : pageSize,
            page:pageNumber,
            pagesCount: Math.ceil(totalCount/ pageSize),
            items:items.flat(1)
        })
        return {
            totalCount : totalCount,
            pageSize : pageSize,
            page:pageNumber,
            pagesCount: Math.ceil(totalCount/ pageSize),
            items: items.flat(1)
        }
    }
    async findPostId(postId:string)  {
        const post:PostsType = await postsCollectionModel.findOne({id:postId}).lean()
        return convertBloggerPost(post)

    }
    async deletePostId(postId:string){
        const res = await postsCollectionModel.deleteOne({id:postId})
        return res.deletedCount === 1
    }
    async createPost(newPost){
        await postsCollectionModel.insertMany([newPost])
        const posts = await Promise.all([convertBloggerPost(newPost)])
        console.log("posts",posts)
        return  posts
    }
    async updatePostId(postId:string,title:string,content:string,shortDescription:string,bloggerId:string){
        let searchBlogger = await bloggersCollectionModel.findOne({id:bloggerId})
            await postsCollectionModel.updateOne({id:postId},
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


