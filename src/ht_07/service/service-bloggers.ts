import {BloggerGetPostType, BloggersGetType, bloggersRepositoryDb04} from "../repositories/bloggers-repositories07";
import {BloggerMongoDBType} from "../types";
import {v4 as uuidv4} from "uuid";


class BloggersService07 {
    async findBloggers(pageNumber:number, pageSize:number,searchNameTerm:string) : Promise<BloggersGetType>{
        return bloggersRepositoryDb04.findBloggers(pageNumber,pageSize,searchNameTerm)
    }
    async findBloggerId(bloggerId:string): Promise<{id:string, name:string,youtubeUrl:string} | string >{
        return  bloggersRepositoryDb04.findBloggerId(bloggerId)
    }
    async findIdBloggerPosts(pageNumber:number, pageSize:number ,bloggerId:string): Promise< BloggerGetPostType | string >{
        return  bloggersRepositoryDb04.findBloggerIdPosts(pageNumber,pageSize, bloggerId)
    }
    async removeBloggerId(bloggerId:string) : Promise<boolean>{
        return bloggersRepositoryDb04.removeBloggerId(bloggerId)
    }
    async createBlogger(name:string, youtubeUrl:string) : Promise<BloggerMongoDBType>{
        const newBlogger = new BloggerMongoDBType (uuidv4(),name,youtubeUrl)
        return bloggersRepositoryDb04.createBlogger(newBlogger)
    }
    async updateBlogger(bloggerId:string,newName:string,newYoutubeUrl:string){
        return bloggersRepositoryDb04.updateBlogger(bloggerId,newName,newYoutubeUrl)
    }
}

export const bloggersServiceDb04 = new BloggersService07()
