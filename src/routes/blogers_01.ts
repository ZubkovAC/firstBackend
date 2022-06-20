import {Request, Response, Router} from "express";

export const bloggers_01_Router = Router({})

let bloggers = [
    {
        "id": 1,
        "name": "Dumych",
        "youtubeUrl": "https://www.youtube.com/c/ITINCUBATOR"
    },{
        "id": 2,
        "name": "it-kamasutra",
        "youtubeUrl": "https://www.youtube.com/c/ITKAMASUTRA"
    },{
        "id": 3,
        "name": "UlbiTV",
        "youtubeUrl": "https://www.youtube.com/c/UlbiTV"
    },
]

bloggers_01_Router.get('/api/bloggers',(req: Request, res: Response) => {
    res.status(200).send(bloggers)
})

bloggers_01_Router.post('/api/bloggers',(req: Request, res: Response) => {
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl

    if(name.length <= 15 && youtubeUrl.length < 101){
        const newVideo = {
            "id": bloggers.length+1,
            "name":req.body.name,
            "youtubeUrl": req.body.youtubeUrl
        }
        bloggers.push(newVideo)
        res.status(201).send(newVideo)
        return
    }
    res.status(400).send({
        "errorsMessages": [
            {
                "message": "string",
                "field": "string"
            }
        ],
        "resultCode": 0
    })
})
bloggers_01_Router.get('/api/bloggers/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    const videoId = bloggers.find(v=>v.id === id)
    if(videoId){
        res.status(200).send(videoId)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
})

bloggers_01_Router.put('/api/bloggers/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    const newName = req.body.name
    const newYoutubeUrl = req.body.youtubeUrl
    const videoId = bloggers.find(v=>v.id === id)
    if(videoId && newName.length <= 15 && newYoutubeUrl.length <= 100 ){
        videoId.name = newName
        videoId.youtubeUrl = newYoutubeUrl
        res.status(200).send(videoId)
        return
    }
    if(videoId || newName.length > 15 || newYoutubeUrl.length > 100){
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "string",
                    "field": "string"
                }
            ],
            "resultCode": 0
        })
        return
    }
    if(!videoId){
        res.status(204).send('No Content')
        return;
    }
})

bloggers_01_Router.delete('/api/bloggers/:id',(req: Request, res: Response) => {
    const bloggerDeleteId = +req.params.id
    const newBloggers = bloggers.filter(v=>v.id !== bloggerDeleteId)
    if(newBloggers.length < bloggers.length){
        bloggers = newBloggers
        res.send(204)
        return
    }
    res.send(404)
    return;
})


let posts =[
    {
        "id": 1,
        "title": "newMessage",
        "shortDescription": "new group 28 may",
        "content": "sale 20%",
        "bloggerId": 0,
        "bloggerName": "Dumich"
    },{
        "id": 2,
        "title": "new Video",
        "shortDescription": "react 18",
        "content": "new hooks",
        "bloggerId": 1,
        "bloggerName": "it-kamasutra"
    },{
        "id": 3,
        "title": "next js",
        "shortDescription": "one video project next js",
        "content": "next js start-end",
        "bloggerId": 2,
        "bloggerName": "UlbiTV"
    },
]

bloggers_01_Router.get('/api/posts',(req: Request, res: Response) => {
    res.status(200).send(posts)
})
bloggers_01_Router.post('/api/posts',(req: Request, res: Response) => {
    if(req.body.title.length > 30 || req.body.shortDescription.length > 100 || +req.body.bloggerId > 1000){
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "If the inputModel has incorrect values",
                    "field": "string"
                }
            ],
            "resultCode": 0
        })
        return;
    }

    const newVideo = {
        "id": posts.length+1,
        "title": req.body.title,
        "shortDescription": req.body.shortDescription,
        "content": req.body.content,
        "bloggerId": req.body.bloggerId,
        "bloggerName": bloggers.find(b=>b.id === req.body.bloggerId).name,
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

    if(req.body.title.length > 30 || req.body.shortDescription.length > 100 || +req.body.bloggerId > 1000){
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "If the inputModel has incorrect values",
                    "field": "string"
                }
            ],
            "resultCode": 0
        })
        return;
    }

    if(searchPost){
        const updatePost = {
            "id": searchPost.id,
            title:req.body.title,
            shortDescription:req.body.shortDescription,
            content:req.body.content,
            bloggerId:id,
            "bloggerName": bloggers.find(b=>b.id === req.body.bloggerId).name
        }
        searchPost = updatePost
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
        res.status(204)
        return
    }
    res.send(404)
    return;
})
