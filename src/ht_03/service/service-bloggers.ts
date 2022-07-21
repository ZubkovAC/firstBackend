import {bloggersCollection, BloggersType} from "../db";
import {BloggerGetPostType, BloggersGetType, bloggersRepositoryDb03} from "../repositories/bloggers-repositories03";



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

export const bloggersServiceDb03 = {
    async findBloggers(pageNumber:number, pageSize:number,searchNameTerm:string) : Promise<BloggersGetType>{
        return bloggersRepositoryDb03.findBloggers(pageNumber,pageSize,searchNameTerm)
    },
    async findBloggerId(bloggerId:number): Promise<{id:number, name:string,youtubeUrl:string} | string >{
        return  bloggersRepositoryDb03.findBloggerId(bloggerId)

    },
    async findIdBloggerPosts(pageNumber:number, pageSize:number ,bloggerId:number): Promise< BloggerGetPostType | string >{
        return  bloggersRepositoryDb03.findBloggerIdPosts(pageNumber,pageSize, bloggerId)
    },
    async removeBloggerId(bloggerId:number) : Promise<boolean>{
        return bloggersRepositoryDb03.removeBloggerId(bloggerId)
    },
    async createBlogger(name:string, youtubeUrl:string){
        return bloggersRepositoryDb03.createBlogger(name,youtubeUrl)
    },
    async updateBlogger(bloggerId:number,newName:string,newYoutubeUrl:string){
        return bloggersRepositoryDb03.updateBlogger(bloggerId,newName,newYoutubeUrl)
    },
}
