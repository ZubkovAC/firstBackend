import {bloggers} from "../repositories/bloggers-repositories04";
import {postsRepositories04} from "../repositories/posts-repositories04";

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

export const postsService04 ={
    async findPosts(pageNumber:number, pageSize:number){
        return postsRepositories04.findPosts(pageNumber,pageSize)
    },
    async findPostId(postId:number){
        return postsRepositories04.findPostId(postId)
    },
    async deletePostId(postId:number){
        return postsRepositories04.deletePostId(postId)
    },
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:number){
        return postsRepositories04.createPost(title,shortDescription,content,bloggerId)
    },
    async createBloggerIdPost(title:string,shortDescription:string,content:string ,bloggerId:number){
        return postsRepositories04.createPost(title,shortDescription,content,bloggerId)
    },
    async updatePostId(postId:number,title:string,content:string,shortDescription:string,bloggerId:number){
        return postsRepositories04.updatePostId(postId,title,content,shortDescription,bloggerId)
    }
}
