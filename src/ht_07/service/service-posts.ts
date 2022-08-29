import {PostsRepositories} from "../repositories/posts-repositories07";
import {inject, injectable} from "inversify";
import {bloggersCollectionModel} from "../db";
import {v4 as uuidv4} from "uuid";
import {LikesRepositories} from "../repositories/likes-repositories";
import {LikesService} from "./likes-service";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepositories)
                protected postsRepositories:PostsRepositories,
                @inject(LikesRepositories)
                protected likesRepositories:LikesRepositories,
                @inject(LikesService)
                protected serviceLikes : LikesService
    ) {}
    async findPosts(pageNumber:number, pageSize:number){
        return this.postsRepositories.findPosts(pageNumber,pageSize)
    }
    async findPostId(postId:string){
        return this.postsRepositories.findPostId(postId)
    }
    async deletePostId(postId:string){
        return this.postsRepositories.deletePostId(postId)
    }
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        let searchBlogger = await bloggersCollectionModel.findOne({id:bloggerId})
        const id = uuidv4()
        const newPost = {
            id: id,
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: searchBlogger.name,
            addedAt:new Date().toISOString()
        }
        const newLikesObject = {
            id:id,
            newestLikes: []
        }

        const likes = await this.likesRepositories.createLikesId(newLikesObject)
        const post = await this.postsRepositories.createPost(newPost)
        const reLikes = await this.serviceLikes.baseLikesSchema()
        return post
    }
    async createBloggerIdPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        let searchBlogger = await bloggersCollectionModel.findOne({id:bloggerId})
        const id = uuidv4()
        const newPost = {
            "id": id,
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": searchBlogger.name,
            addedAt:new Date().toISOString()
        }
        return this.postsRepositories.createPost(newPost)
    }
    async updatePostId(postId:string,title:string,content:string,shortDescription:string,bloggerId:string){
        return this.postsRepositories.updatePostId(postId,title,content,shortDescription,bloggerId)
    }
}
