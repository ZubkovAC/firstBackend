import {bloggersCollectionModel, postsCollectionModel} from "../db";
import {
    BloggerPostsMongoType,
    convertBlogger,
    convertBloggerId,
    convertBloggers,
    convertBloggersPosts
} from "../convert/convert";
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
        const totalCount = await bloggersCollectionModel.countDocuments(query)

        const bloggersRestrict:Array<BloggerType> =
            await bloggersCollectionModel
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
        let searchBloggerId : BloggersType | null = await bloggersCollectionModel.findOne({id:bloggerId})
        if(searchBloggerId){
            return convertBloggerId(searchBloggerId)
        }
        return  ""
    }
    async findBloggerIdPosts(pageNumber:number, pageSize:number ,bloggerId:string,userId:string): Promise< BloggerGetPostType | string >{
        let searchBloggerId : BloggersType | null = await bloggersCollectionModel.findOne({id:bloggerId})
        let skipCount = (pageNumber-1) * pageSize
        const allPostsBlogger = await postsCollectionModel.find({bloggerId:bloggerId}).lean()
        const allPostsBloggerLength = allPostsBlogger.length
        let postsBlogger :Array<BloggerPostsMongoType> = await  postsCollectionModel
            .find({bloggerId:bloggerId})
            .skip(skipCount)
            .limit(pageSize)
            .lean()
        const items = await Promise.all([convertBloggersPosts(postsBlogger,userId)])
        if(searchBloggerId && postsBlogger){
            return {
                pagesCount: Math.ceil(allPostsBloggerLength / pageSize),
                page: pageNumber,
                pageSize : pageSize,
                totalCount : allPostsBloggerLength,
                items: items.flat(1)
            }
        }
        return  ""
    }
    async removeBloggerId(bloggerId:string) : Promise<boolean>{
        const  findBloggerId =  await bloggersCollectionModel.deleteOne({id:bloggerId})
        return findBloggerId.deletedCount === 1
    }
    async createBlogger(newBlogger :BloggerMongoDBType) : Promise<BloggerMongoDBType>{
        await bloggersCollectionModel.insertMany([newBlogger])
        return convertBlogger(newBlogger)
    }
    async updateBlogger(bloggerId:string,newName:string,newYoutubeUrl:string){
        const newBloggerId = await bloggersCollectionModel.updateOne({id:bloggerId},{ $set:{name:newName,youtubeUrl:newYoutubeUrl}})
        if(newBloggerId.matchedCount === 1){
            return {newBloggerId:newBloggerId,error:204}
        }
        return {error: 404}
    }
}


