import {PostsRepositories} from "../repositories/posts-repositories07";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepositories) protected postsRepositories:PostsRepositories) {}
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
        return this.postsRepositories.createPost(title,shortDescription,content,bloggerId)
    }
    async createBloggerIdPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        return this.postsRepositories.createPost(title,shortDescription,content,bloggerId)
    }
    async updatePostId(postId:string,title:string,content:string,shortDescription:string,bloggerId:string){
        return this.postsRepositories.updatePostId(postId,title,content,shortDescription,bloggerId)
    }
}
