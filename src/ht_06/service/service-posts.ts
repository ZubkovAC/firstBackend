import {postsRepositories06} from "../repositories/posts-repositories06";

export const postsService04 ={
    async findPosts(pageNumber:number, pageSize:number){
        return postsRepositories06.findPosts(pageNumber,pageSize)
    },
    async findPostId(postId:string){
        return postsRepositories06.findPostId(postId)
    },
    async deletePostId(postId:string){
        return postsRepositories06.deletePostId(postId)
    },
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        return postsRepositories06.createPost(title,shortDescription,content,bloggerId)
    },
    async createBloggerIdPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        return postsRepositories06.createPost(title,shortDescription,content,bloggerId)
    },
    async updatePostId(postId:string,title:string,content:string,shortDescription:string,bloggerId:string){
        return postsRepositories06.updatePostId(postId,title,content,shortDescription,bloggerId)
    }
}
