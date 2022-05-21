import {Request, Response, Router} from "express";

export const posts_01_Router = Router({})

const posts =[
    {
        "id": 0,
        "title": "newMessage",
        "shortDescription": "new group 28 may",
        "content": "sale 20%",
        "bloggerId": 0,
        "bloggerName": "Dumich"
    },{
        "id": 1,
        "title": "new Video",
        "shortDescription": "react 18",
        "content": "new hooks",
        "bloggerId": 1,
        "bloggerName": "it-kamasutra"
    },{
        "id": 2,
        "title": "next js",
        "shortDescription": "one video project next js",
        "content": "next js start-end",
        "bloggerId": 2,
        "bloggerName": "UlbiTV"
    },
]

posts_01_Router.get('/api/posts',(req: Request, res: Response) => {
    res.status(200).send(posts)
})
posts_01_Router.post('/api/posts',(req: Request, res: Response) => {
    // if(req.body.name.length <= 40){
        const newVideo = {
            "id": 3,
            "title": req.body.title,
            "shortDescription": req.body.shortDescription,
            "content": req.body.content,
            "bloggerId": req.body.bloggerId,
            "bloggerName": "Dumych",
        }
        posts.push(newVideo)
        res.status(201).send(newVideo)
        return
    // }
    // res.status(400).send({
    //     "errorsMessages": [
    //         {
    //             "message": "string",
    //             "field": "string"
    //         }
    //     ],
    //     "resultCode": 0
    // })
})
posts_01_Router.get('/api/posts/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    const videoId = posts.find(v=>v.id === id)
    if(videoId){
        res.status(200).send(videoId)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
})

posts_01_Router.put('/api/posts/:id',(req: Request, res: Response) => {
    const id = +req.params.id

    const updatePost = {
        "id": 2,
        title:req.body.title,
        shortDescription:req.body.shortDescription,
        content:req.body.content,
        bloggerId:id,
        "bloggerName": "Dumych"
    }
    let searchPost = posts.find(p=>p.id ===id)

    searchPost = {...updatePost}

    res.status(200).send(posts)

    // if(postId && newName.length <= 40 ){
    //     videoId.name = newName
    //     videoId.youtubeUrl = newYoutubeUrl
    //     res.status(200).send(videoId)
    //     return
    // }
    // if(videoId && newName.length > 40 ){
    //     res.status(400).send({
    //         "errorsMessages": [
    //             {
    //                 "message": "string",
    //                 "field": "string"
    //             }
    //         ],
    //         "resultCode": 0
    //     })
    //     return
    // }
    // if(!videoId){
    //     res.status(204).send('No Content')
    //     return;
    // }
    // res.status(404).send({
    //     "errorsMessages": [
    //         {
    //             "message": "string",
    //             "field": "string"
    //         }
    //     ],
    //     "resultCode": 0
    // })
    // return;
})

posts_01_Router.delete('/api/posts/:id',(req: Request, res: Response) => {
    const bloggerDeleteId = +req.params.id
    const newPosts = posts.filter(v=>v.id !== bloggerDeleteId)
    if(newPosts.length === posts.length){
        res.status(204)
        return
    }
    res.status(200).send(newPosts)
    return;
})
