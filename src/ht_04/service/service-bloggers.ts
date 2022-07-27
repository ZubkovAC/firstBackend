import {bloggersCollection, BloggersType} from "../db";
import {BloggerGetPostType, BloggersGetType, bloggersRepositoryDb04} from "../repositories/bloggers-repositories04";



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

export const bloggersServiceDb04 = {
    async findBloggers(pageNumber:number, pageSize:number,searchNameTerm:string) : Promise<BloggersGetType>{
        return bloggersRepositoryDb04.findBloggers(pageNumber,pageSize,searchNameTerm)
    },
    async findBloggerId(bloggerId:number): Promise<{id:number, name:string,youtubeUrl:string} | string >{
        return  bloggersRepositoryDb04.findBloggerId(bloggerId)

    },
    async findIdBloggerPosts(pageNumber:number, pageSize:number ,bloggerId:number): Promise< BloggerGetPostType | string >{
        return  bloggersRepositoryDb04.findBloggerIdPosts(pageNumber,pageSize, bloggerId)
    },
    async removeBloggerId(bloggerId:number) : Promise<boolean>{
        return bloggersRepositoryDb04.removeBloggerId(bloggerId)
    },
    async createBlogger(name:string, youtubeUrl:string){
        return bloggersRepositoryDb04.createBlogger(name,youtubeUrl)
    },
    async updateBlogger(bloggerId:number,newName:string,newYoutubeUrl:string){
        return bloggersRepositoryDb04.updateBlogger(bloggerId,newName,newYoutubeUrl)
    },
}
