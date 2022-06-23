import {bloggers} from "./bloggers-repositories";

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

export const postsRepositories ={
    findPosts(){
        return posts
    },
    findPostId(postId:number){
        const post = posts.find(v=>v.id === postId)
        if(post){
            return {post:post,status:true}
        }
        return {status:false}
    },
    deletePostId(postId:number){
        console.log("postId",postId)
        const newPosts = posts.filter(v=>v.id !== postId)
        if(newPosts.length < posts.length){
            posts = newPosts
            return true
        }
        return false
    },
    createPost(title:string,shortDescription:string,content:string ,bloggerId:number){
        let searchBlogger = bloggers.find(b=>b.id === bloggerId)? bloggers.find(b=>b.id === bloggerId).name :''
        if(!searchBlogger ){
            return {errorsMessages:{ message: "non found bloggerId ", field: "bloggerId" } ,status:400}
        }
        const newVideo = {
            "id": posts.length+1,
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": bloggerId,
            "bloggerName": bloggers.find(b=>b.id === bloggerId).name
        }
        posts.push(newVideo)
        return {newVideo:newVideo ,status:201}
    },
    updatePostId(postId:number,title:string,content:string,shortDescription:string,bloggerId:number){
        let searchPost = posts.find(p =>p.id === postId)
        let searchBlogger = bloggers.find(b=>b.id === bloggerId)? bloggers.find(b=>b.id === bloggerId).id :''
        if(!searchBlogger ){
            return {"errorsMessages": { message: "non found bloggerId ", field: "bloggerId" },status:400}
        }

        if(searchPost){
            const updatePost = {
                "id": postId,
                title:title,
                shortDescription:shortDescription,
                content:content,
                bloggerId:bloggerId,
                "bloggerName": bloggers.find(b=>b.id === bloggerId).name
            }
            posts = posts.map(p=> p.id === updatePost.id ? {...updatePost} : p)
            return {status:204}
        }
         return {status:404}
    }
}
