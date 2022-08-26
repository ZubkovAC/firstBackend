import {
    BloggerGetPostType,
    BloggerRepositoryDB07,
    BloggersGetType,
} from "../repositories/bloggers-repositories07";
import {BloggerMongoDBType} from "../types";
import {v4 as uuidv4} from "uuid";

export class BloggersService07 {
    constructor(protected bloggersRepository:BloggerRepositoryDB07) {}

    async findBloggers(pageNumber:number, pageSize:number,searchNameTerm:string) : Promise<BloggersGetType>{
        return this.bloggersRepository.findBloggers(pageNumber,pageSize,searchNameTerm)
    }
    async findBloggerId(bloggerId:string): Promise<{id:string, name:string,youtubeUrl:string} | string >{
        return this.bloggersRepository.findBloggerId(bloggerId)
    }
    async findIdBloggerPosts(pageNumber:number, pageSize:number ,bloggerId:string): Promise< BloggerGetPostType | string >{
        return  this.bloggersRepository.findBloggerIdPosts(pageNumber,pageSize, bloggerId)
    }
    async removeBloggerId(bloggerId:string) : Promise<boolean>{
        return this.bloggersRepository.removeBloggerId(bloggerId)
    }
    async createBlogger(name:string, youtubeUrl:string) : Promise<BloggerMongoDBType>{
        const newBlogger = new BloggerMongoDBType (uuidv4(),name,youtubeUrl)
        return this.bloggersRepository.createBlogger(newBlogger)
    }
    async updateBlogger(bloggerId:string,newName:string,newYoutubeUrl:string){
        return this.bloggersRepository.updateBlogger(bloggerId,newName,newYoutubeUrl)
    }
}
