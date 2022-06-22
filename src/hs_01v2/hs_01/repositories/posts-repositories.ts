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
        const newPosts = posts.filter(v=>v.id !== postId)
        if(newPosts.length < posts.length){
            return true
        }
        return false
    },
    createPost(title:string,shortDescription:string,content:string ,bloggerId:number){
        let searchBlogger = bloggers.find(b=>b.id === bloggerId)? bloggers.find(b=>b.id === bloggerId).name :''
        if(!searchBlogger ||!shortDescription || !title || !content || title.length > 30 || shortDescription.length > 100 || content.length > 1000){
            const errorsMessages =[]
            if( !title || title.length > 30 ){
                errorsMessages.push({message: "If the inputModel has incorrect title", field: "title"})
            }if( !shortDescription ||  shortDescription.length > 100 ){
                errorsMessages.push({message: "If the inputModel has incorrect shortDescription", field: "shortDescription"})
            }if( !content || content.length > 1000 ){
                errorsMessages.push({message: "max length content 1000 ", field: "content"})
            }if( !searchBlogger ){
                errorsMessages.push({ message: "non found bloggerId ", field: "bloggerId" })
            }
            return {errorsMessages:errorsMessages ,status:400}
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
        if(!searchBlogger || !shortDescription || !title || !content || title.length > 30 || shortDescription.length > 100 || content.length > 1000){
            const errorsMessages =[]
            if( !title || title.length > 30 ){
                errorsMessages.push({ message: "incorrect value title", field: "title" })
            }if( !shortDescription ||  shortDescription.length > 100 ){
                errorsMessages.push({ message: "incorrect value shortDescription", field: "shortDescription" })
            }if( !content || content.length > 1000  ){
                errorsMessages.push({ message: "max length content 1000 ", field: "content" })
            }if( !searchBlogger ){
                errorsMessages.push({ message: "non found bloggerId ", field: "bloggerId" })
            }
            return {"errorsMessages": errorsMessages,status:400}
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
