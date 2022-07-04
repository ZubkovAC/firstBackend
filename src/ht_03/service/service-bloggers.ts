import {bloggersCollection} from "../db";

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


export const bloggersInMemoryDb03 = {
    async findBloggers() : Promise<Array<{id:number, name:string,youtubeUrl:string}>>{
        return bloggersCollection.find({}).toArray()
    },
    async findBloggerId(bloggerId:number): Promise<{id:number, name:string,youtubeUrl:string} | string >{
        let searchBloggerId : BloggersType | null = await bloggersCollection.findOne({id:bloggerId})
        if(searchBloggerId){
            return searchBloggerId
        }
        return  ""

    },
    async removeBloggerId(bloggerId:number) : Promise<boolean>{
        const  findBloggerId =  await bloggersCollection.deleteOne({id:bloggerId})
        return findBloggerId.deletedCount === 1
    },
    async createBlogger(name:string, youtubeUrl:string){
        const newVideo = {
            "id": bloggers.length+1,
            "name":name,
            "youtubeUrl": youtubeUrl
        }
        await bloggersCollection.insertOne(newVideo)
        return {newVideo:newVideo,error:false}
    },
    async updateBlogger(bloggerId:number,newName:string,newYoutubeUrl:string){
        const newBloggerId = await bloggersCollection.updateOne({id:bloggerId},{ $set:{name:newName,youtubeUrl:newYoutubeUrl}})
        if(newBloggerId.matchedCount === 1){
            return {videoId:newBloggerId,error:204}
        }
        return {error: 404}
    },
}
