import {bloggers} from "./bloggers-repositories03";
import {bloggersCollection, postsCollection} from "../db";

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

export const postsRepositories03 ={
    async findPosts(){
        return postsCollection.find({}).toArray()
    },
    async findPostId(postId:number){
        const post = await postsCollection.findOne({id:postId})
        if(post){
            return {post:post,status:true}
        }
        return {status:false}
    },
    async deletePostId(postId:number){
        const res = await postsCollection.deleteOne({id:postId})
        return res.deletedCount === 1
    },
    async createPost(title:string,shortDescription:string,content:string ,bloggerId:number){
        let searchBlogger = await bloggersCollection.findOne({id:bloggerId})
        if(!searchBlogger ){
            return {errorsMessages:{ message: "non found bloggerId ", field: "bloggerId" } ,status:400}
        }
        const newVideo = {
            "id": + new Date(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": searchBlogger.name
        }
        posts.push(newVideo)
        await postsCollection.insertOne(newVideo)
        return {newVideo:newVideo ,status:201}
    },

    async updatePostId(postId:number,title:string,content:string,shortDescription:string,bloggerId:number){
        let searchPost = await postsCollection.findOne({id:postId})
        let searchBlogger = await bloggersCollection.findOne({id:bloggerId})
        if(!searchBlogger ){
            return {"errorsMessages": { message: "non found bloggerId ", field: "bloggerId" },status:400}
        }
        if(searchPost){
            await postsCollection.updateOne({id:postId},
                { $set:
                        {   id:postId,
                            title:title,
                            shortDescription:shortDescription,
                            content:content,
                            bloggerId:bloggerId,
                            bloggerName:searchBlogger.name
                        }})
            return {status:204}
        }
         return {status:404}
    }
}
