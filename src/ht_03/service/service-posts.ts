import {bloggers} from "../repositories/bloggers-repositories03";
import {postsRepositories03} from "../repositories/posts-repositories03";

let posts =[
    {
        "id": 1,
        "title": "newMessage",
        "shortDescription": "new group 28 may",
        "content": "sale 20%",
        "bloggerId": 1,
        "bloggerName": "Dumich"
    },{
        "id": 2,
        "title": "new Video",
        "shortDescription": "react 18",
        "content": "new hooks",
        "bloggerId": 2,
        "bloggerName": "it-kamasutra"
    },{
        "id": 3,
        "title": "next js",
        "shortDescription": "one video project next js",
        "content": "next js start-end",
        "bloggerId": 3,
        "bloggerName": "UlbiTV"
    },
]

export const postsService03 ={
    async findPosts(pageNumber:number, pageSize:number){
        return postsRepositories03.findPosts(pageNumber,pageSize)
    },
    async findPostId(postId:number){
        return postsRepositories03.findPostId(postId)
    },
    async deletePostId(postId:number){
        return postsRepositories03.deletePostId(postId)
    },
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:number){
        return postsRepositories03.createPost(title,shortDescription,content,bloggerId)
    },
    async createBloggerIdPost(title:string,shortDescription:string,content:string ,bloggerId:number){
        return postsRepositories03.createPost(title,shortDescription,content,bloggerId)
    },
    async updatePostId(postId:number,title:string,content:string,shortDescription:string,bloggerId:number){
        return postsRepositories03.updatePostId(postId,title,content,shortDescription,bloggerId)
    }
}
