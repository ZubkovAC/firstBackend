import {postsRepositories04} from "../repositories/posts-repositories04";

export const postsService04 ={
    async findPosts(pageNumber:number, pageSize:number){
        return postsRepositories04.findPosts(pageNumber,pageSize)
    },
    async findPostId(postId:string){
        return postsRepositories04.findPostId(postId)
    },
    async deletePostId(postId:string){
        return postsRepositories04.deletePostId(postId)
    },
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        return postsRepositories04.createPost(title,shortDescription,content,bloggerId)
    },
    async createBloggerIdPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        return postsRepositories04.createPost(title,shortDescription,content,bloggerId)
    },
    async updatePostId(postId:string,title:string,content:string,shortDescription:string,bloggerId:string){
        return postsRepositories04.updatePostId(postId,title,content,shortDescription,bloggerId)
    }
}
