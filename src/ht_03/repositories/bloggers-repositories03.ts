import {bloggersCollection, postsCollection} from "../db";
import {convertBlogger, convertBloggerId, convertBloggers, convertBloggersPosts} from "../convert/convert";

export type BloggersType = {
    id:number
    name:string
    youtubeUrl:string
}

export let bloggers : Array<BloggersType> = [
    {
        "id": 1,
        "name": "Dumych",
        "youtubeUrl": "https://www.youtube.com/c/ITINCUBATOR"
    },{
        "id": 2,
        "name": "it-kamasutra",
        "youtubeUrl": "https://www.youtube.com/c/ITKAMASUTRA"
    },{
        "id": 3,
        "name": "UlbiTV",
        "youtubeUrl": "https://www.youtube.com/c/UlbiTV"
    },
]

// let expression = '/^https:\/\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/'
let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

export type BloggersGetType = {
    pagesCount:number
    pageSize:number
    page:number
    totalCount:number
    items:Array<{id:number, name:string,youtubeUrl:string}>
}
export type BloggerGetPostType = {
    pagesCount:number
    pageSize:number
    page:number
    totalCount:number
    items:Array<{ id: number
        "title": string
        "shortDescription": string
        "content": string
        "bloggerId": number
        "bloggerName": string}>
}
export const bloggersRepositoryDb03 = {
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
            totalCount : totalCount,
            pageSize : pageSize,
            page:pageNumber,
            pagesCount: Math.ceil(totalCount/ pageSize),
            items: convertBloggers(bloggersRestrict)
        }
    },
    async findBloggerId(bloggerId:number): Promise<{id:number, name:string,youtubeUrl:string} | string >{
        let searchBloggerId : BloggersType | null = await bloggersCollection.findOne({id:bloggerId})
        if(searchBloggerId){
            return convertBloggerId(searchBloggerId)
        }
        return  ""
    },
    async findBloggerIdPosts(pageNumber:number, pageSize:number ,bloggerId:number): Promise< BloggerGetPostType | string >{
        let searchBloggerId : BloggersType | null = await bloggersCollection.findOne({id:bloggerId})
        let postsBlogger = await  postsCollection.find({bloggerId:bloggerId}).toArray()
        if(searchBloggerId && postsBlogger){
            return {
                totalCount : postsBlogger.length,
                pageSize : pageSize,
                page: pageNumber,
                pagesCount: Math.ceil(postsBlogger.length / pageSize),
                items: convertBloggersPosts(postsBlogger)
            }
        }
        return  ""
    },
    async removeBloggerId(bloggerId:number) : Promise<boolean>{
        const  findBloggerId =  await bloggersCollection.deleteOne({id:bloggerId})
        return findBloggerId.deletedCount === 1
    },
    async createBlogger(name:string, youtubeUrl:string){
        const newBlogger = {
            "id": +new Date(),
            "name":name,
            "youtubeUrl": youtubeUrl
        }
        await bloggersCollection.insertOne(newBlogger)
        return {newBlogger:convertBlogger(newBlogger),error:false}
    },
    async updateBlogger(bloggerId:number,newName:string,newYoutubeUrl:string){
        const newBloggerId = await bloggersCollection.updateOne({id:bloggerId},{ $set:{name:newName,youtubeUrl:newYoutubeUrl}})
        if(newBloggerId.matchedCount === 1){
            return {newBloggerId:newBloggerId,error:204}
        }
        return {error: 404}
    },
}
