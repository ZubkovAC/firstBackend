import {postsRepositories07} from "../repositories/posts-repositories07";

export const postsService04 ={
    async findPosts(pageNumber:number, pageSize:number){
        return postsRepositories07.findPosts(pageNumber,pageSize)
    },
    async findPostId(postId:string){
        return postsRepositories07.findPostId(postId)
    },
    async deletePostId(postId:string){
        return postsRepositories07.deletePostId(postId)
    },
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        return postsRepositories07.createPost(title,shortDescription,content,bloggerId)
    },
    async createBloggerIdPost(title:string,shortDescription:string,content:string ,bloggerId:string){
        return postsRepositories07.createPost(title,shortDescription,content,bloggerId)
    },
    async updatePostId(postId:string,title:string,content:string,shortDescription:string,bloggerId:string){
        return postsRepositories07.updatePostId(postId,title,content,shortDescription,bloggerId)
    }
}
