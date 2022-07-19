import {bloggersCollection, postsCollection} from "../db";

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
    async findBloggers(pageNumber,pageSize) : Promise<BloggersGetType >{
        let skipCount = (pageNumber-1) * pageSize
        const totalCount = await bloggersCollection.countDocuments()
        const bloggersRestrict =
            await bloggersCollection
                .find({})
                .skip(skipCount)
                .limit(pageSize)
                .toArray()

        return {
            totalCount : totalCount,
            pageSize : pageSize,
            page:pageNumber,
            pagesCount: Math.ceil(totalCount/ pageSize),
            items: bloggersRestrict.map(b =>({
                id:b.id,
                name:b.name,
                youtubeUrl:b.youtubeUrl
            }))
        }
    },
    async findBloggerId(bloggerId:number): Promise<{id:number, name:string,youtubeUrl:string} | string >{
        let searchBloggerId : BloggersType | null = await bloggersCollection.findOne({id:bloggerId})
        if(searchBloggerId){
            return searchBloggerId
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
                items: postsBlogger
            }
        }
        return  ""
    },
    async removeBloggerId(bloggerId:number) : Promise<boolean>{
        const  findBloggerId =  await bloggersCollection.deleteOne({id:bloggerId})
        return findBloggerId.deletedCount === 1
    },
    async createBlogger(name:string, youtubeUrl:string){
        const newVideo = {
            "id": +new Date(),
            "name":name,
            "youtubeUrl": youtubeUrl
        }
        await bloggersCollection.insertOne(newVideo)
        return {newVideo:newVideo,error:false}
    },
    async updateBlogger(bloggerId:number,newName:string,newYoutubeUrl:string){
        const newBloggerId = await bloggersCollection.updateOne({id:bloggerId},{ $set:{name:newName,youtubeUrl:newYoutubeUrl}})
        if(newBloggerId.matchedCount === 1){
            return {newBloggerId:newBloggerId,error:204}
        }
        return {error: 404}
    },
}
