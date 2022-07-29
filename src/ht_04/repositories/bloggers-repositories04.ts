import {bloggersCollection, postsCollection} from "../db";
import {convertBlogger, convertBloggerId, convertBloggers, convertBloggersPosts} from "../convert/convert";
import { v4 as uuidv4 } from 'uuid'

export type BloggersType = {
    id:string
    name:string
    youtubeUrl:string
}

// let expression = '/^https:\/\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/'
let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

export type BloggersGetType = {
    pagesCount:number
    pageSize:number
    page:number
    totalCount:number
    items:Array<{id:string, name:string,youtubeUrl:string}>
}
export type BloggerGetPostType = {
    pagesCount:number
    pageSize:number
    page:number
    totalCount:number
    items:Array<{ id: string
        "title": string
        "shortDescription": string
        "content": string
        "bloggerId": string
        "bloggerName": string}>
}

export const bloggersRepositoryDb04 = {
    async findBloggers(pageNumber,pageSize,searchNameTerm) : Promise<BloggersGetType >{
        let skipCount = (pageNumber-1) * pageSize
        const query = {name: {$regex:searchNameTerm}}
        const totalCount = await bloggersCollection.countDocuments(query)

        const bloggersRestrict =
            await bloggersCollection
                .find(query)
                .skip(skipCount)
                .limit(pageSize)
                .toArray()

        return {
            pagesCount: Math.ceil(totalCount/ pageSize),
            page:pageNumber,
            pageSize : pageSize,
            totalCount : totalCount,
            items: convertBloggers(bloggersRestrict)
        }
    },
    async findBloggerId(bloggerId:string): Promise<BloggersType | string >{
        let searchBloggerId : BloggersType | null = await bloggersCollection.findOne({id:bloggerId})
        if(searchBloggerId){
            return convertBloggerId(searchBloggerId)
        }
        return  ""
    },
    async findBloggerIdPosts(pageNumber:number, pageSize:number ,bloggerId:string): Promise< BloggerGetPostType | string >{
        let searchBloggerId : BloggersType | null = await bloggersCollection.findOne({id:bloggerId})
        let skipCount = (pageNumber-1) * pageSize
        const allPostsBlogger = await postsCollection.find({bloggerId:bloggerId}).toArray()
        const allPostsBloggerLength = allPostsBlogger.length
        let postsBlogger = await  postsCollection
            .find({bloggerId:bloggerId})
            .skip(skipCount)
            .limit(pageSize)
            .toArray()
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
    },
    async removeBloggerId(bloggerId:string) : Promise<boolean>{
        const  findBloggerId =  await bloggersCollection.deleteOne({id:bloggerId})
        return findBloggerId.deletedCount === 1
    },
    async createBlogger(name:string, youtubeUrl:string){
        const newBlogger = {
            "id":  uuidv4(),
            "name":name,
            "youtubeUrl": youtubeUrl
        }
        await bloggersCollection.insertOne(newBlogger)
        return {newBlogger:convertBlogger(newBlogger),error:false}
    },
    async updateBlogger(bloggerId:string,newName:string,newYoutubeUrl:string){
        const newBloggerId = await bloggersCollection.updateOne({id:bloggerId},{ $set:{name:newName,youtubeUrl:newYoutubeUrl}})
        if(newBloggerId.matchedCount === 1){
            return {newBloggerId:newBloggerId,error:204}
        }
        return {error: 404}
    },
}
