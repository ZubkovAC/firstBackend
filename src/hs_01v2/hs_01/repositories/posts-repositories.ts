import {Request, Response} from "express";
import {bloggers_01_Router} from "../hs_01";
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

bloggers_01_Router.get('/api/posts',(req: Request, res: Response) => {
    res.status(200).send(posts)
})
bloggers_01_Router.post('/api/posts',(req: Request, res: Response) => {

    let shortDescription = req.body.shortDescription ? req.body.shortDescription?.trim() : ''
    let title = req.body.title ? req.body.title?.trim() : ''
    let content = req.body.content ? req.body.content?.trim() : ''
    let searchBlogger = bloggers.find(b=>b.id === req.body.bloggerId)? bloggers.find(b=>b.id === req.body.bloggerId).name :''

    if(!searchBlogger ||!shortDescription || !title || !content || title.length > 30 || shortDescription.length > 100 || content.length > 1000){
        const errorsMessages =[]
        if( !title || req.body.title.length > 30 ){
            errorsMessages.push({message: "If the inputModel has incorrect title", field: "title"})
        }if( !shortDescription ||  req.body.shortDescription.length > 100 ){
            errorsMessages.push({message: "If the inputModel has incorrect shortDescription", field: "shortDescription"})
        }if( !content || content.length > 1000 ){
            errorsMessages.push({message: "max length content 1000 ", field: "content"})
        }if( !searchBlogger ){
            errorsMessages.push({ message: "non found bloggerId ", field: "bloggerId" })
        }
        res.status(400).send({errorsMessages:errorsMessages})
        return;
    }

    const newVideo = {
        "id": posts.length+1,
        // "id": req.body.bloggerId,
        "title": req.body.title,
        "shortDescription": req.body.shortDescription,
        "content": req.body.content,
        "bloggerId": req.body.bloggerId,
        "bloggerName": bloggers.find(b=>b.id === req.body.bloggerId).name
    }
    posts.push(newVideo)
    res.status(201).send(newVideo)
    return

})

bloggers_01_Router.get('/api/posts/:id',(req: Request, res: Response) => {
    // if(typeof +req.params.id === "number"){
    //     res.send(400)
    //     return;
    // }
    const id = +req.params.id

    const videoId = posts.find(v=>v.id === id)
    if(videoId){
        res.status(200).send(videoId)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return;
})

bloggers_01_Router.put('/api/posts/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    let searchPost = posts.find(p =>p.id === id)

    let shortDescription = req.body.shortDescription ? req.body.shortDescription?.trim() : ''
    let title = req.body.title ? req.body.title?.trim() : ''
    let content = req.body.content ? req.body.content?.trim() : ''

    let searchBlogger = bloggers.find(b=>b.id === req.body.bloggerId)? bloggers.find(b=>b.id === req.body.bloggerId).id :''

    if(!searchBlogger || !shortDescription || !title || !content || title.length > 30 || shortDescription.length > 100 || content.length > 1000){
        const errorsMessages =[]
        if( !title || req.body.title.length > 30 ){
            errorsMessages.push({ message: "incorrect value title", field: "title" })
        }if( !shortDescription ||  req.body.shortDescription.length > 100 ){
            errorsMessages.push({ message: "incorrect value shortDescription", field: "shortDescription" })
        }if( !content || content.length > 1000  ){
            errorsMessages.push({ message: "max length content 1000 ", field: "content" })
        }if( !searchBlogger ){
            errorsMessages.push({ message: "non found bloggerId ", field: "bloggerId" })
        }
        res.status(400).send({"errorsMessages": errorsMessages})
        return;
    }

    if(searchPost){
        const updatePost = {
            "id": id,
            title:title,
            shortDescription:shortDescription,
            content:content,
            bloggerId:req.body.bloggerId,
            "bloggerName": bloggers.find(b=>b.id === req.body.bloggerId).name
        }
        posts = posts.map(p=> p.id === updatePost.id ? {...updatePost} : p)
        res.send(204)
        return
    }else{
        res.send(404)
    }
})

bloggers_01_Router.delete('/api/posts/:id',(req: Request, res: Response) => {
    const bloggerDeleteId = +req.params.id
    const newPosts = posts.filter(v=>v.id !== bloggerDeleteId)
    if(newPosts.length < posts.length){
        posts = newPosts
        res.send(204)
        return
    }
    res.send(404)
    return;
})