import {bloggersCollection06, postsCollection06} from "../db";
import {
    convertBlogger,
    convertBloggerId,
    convertBloggers,
    convertBloggersPosts
} from "../convert/convert";
import { v4 as uuidv4 } from 'uuid'
import {BloggerMongoDBType} from "../types";
import {injectable} from "inversify";


export type BloggersType = {
    id:string
    name:string
    youtubeUrl:string
}

export type BloggersGetType = {
    pagesCount:number
    pageSize:number
    page:number
    totalCount:number
    items:Array<BloggerType>
}
export type BloggerType={
    id:string
    name:string
    youtubeUrl:string
}
export type BloggerGetPostType = {
    pagesCount:number
    pageSize:number
    page:number
    totalCount:number
    items:Array<BloggerPostType>
}
export type BloggerPostType={
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
}
@injectable()
export class BloggerRepositoryDB07 {
    async findBloggers(pageNumber,pageSize,searchNameTerm) : Promise<BloggersGetType >{
        let skipCount = (pageNumber-1) * pageSize
        const query = {name: {$regex:searchNameTerm}}
        const totalCount = await bloggersCollection06.countDocuments(query)

        const bloggersRestrict:Array<BloggerType> =
            await bloggersCollection06
                .find(query)
                .skip(skipCount)
                .limit(pageSize)
                .lean()
        return {
            pagesCount: Math.ceil(totalCount/ pageSize),
            page:pageNumber,
            pageSize : pageSize,
            totalCount : totalCount,
            items: convertBloggers(bloggersRestrict)
        }
    }
    async findBloggerId(bloggerId:string): Promise<BloggersType | string >{
        let searchBloggerId : BloggersType | null = await bloggersCollection06.findOne({id:bloggerId})
        if(searchBloggerId){
            return convertBloggerId(searchBloggerId)
        }
        return  ""
    }
    async findBloggerIdPosts(pageNumber:number, pageSize:number ,bloggerId:string): Promise< BloggerGetPostType | string >{
        let searchBloggerId : BloggersType | null = await bloggersCollection06.findOne({id:bloggerId})
        let skipCount = (pageNumber-1) * pageSize
        const allPostsBlogger = await postsCollection06.find({bloggerId:bloggerId}).lean()
        const allPostsBloggerLength = allPostsBlogger.length
        let postsBlogger :Array<BloggerPostType> = await  postsCollection06
            .find({bloggerId:bloggerId})
            .skip(skipCount)
            .limit(pageSize)
            .lean()
        if(searchBloggerId && postsBlogger){
            return {
                pagesCount: Math.ceil(allPostsBloggerLength / pageSize),
                page: pageNumber,
                pageSize : pageSize,
                totalCount : allPostsBloggerLength,
                items: convertBloggersPosts(postsBlogger)
            }
        }
        return  ""
    }
    async removeBloggerId(bloggerId:string) : Promise<boolean>{
        const  findBloggerId =  await bloggersCollection06.deleteOne({id:bloggerId})
        return findBloggerId.deletedCount === 1
    }
    async createBlogger(newBlogger :BloggerMongoDBType) : Promise<BloggerMongoDBType>{
        await bloggersCollection06.insertMany([newBlogger])
        return convertBlogger(newBlogger)
    }
    async updateBlogger(bloggerId:string,newName:string,newYoutubeUrl:string){
        const newBloggerId = await bloggersCollection06.updateOne({id:bloggerId},{ $set:{name:newName,youtubeUrl:newYoutubeUrl}})
        if(newBloggerId.matchedCount === 1){
            return {newBloggerId:newBloggerId,error:204}
        }
        return {error: 404}
    }
}

// export const bloggersRepositoryDb04 = new BloggerRepositoryDB07()

