import {Request, Response, Router} from "express";

export const bloggers_01_Router = Router({})

const bloggers = [
    {
        "id": 0,
        "name": "Dumich",
        "youtubeUrl": "https://www.youtube.com/c/ITINCUBATOR"
    },{
        "id": 1,
        "name": "it-kamasutra",
        "youtubeUrl": "https://www.youtube.com/c/ITKAMASUTRA"
    },{
        "id": 2,
        "name": "UlbiTV",
        "youtubeUrl": "https://www.youtube.com/c/UlbiTV"
    },
]

bloggers_01_Router.get('/api/bloggers',(req: Request, res: Response) => {
    res.status(200).send(bloggers)
})
bloggers_01_Router.post('/api/bloggers',(req: Request, res: Response) => {
    if(req.body.name.length <= 40){
        const newVideo = {
            "id": 3,
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
    if(videoId && newName.length <= 40 ){
        videoId.name = newName
        videoId.youtubeUrl = newYoutubeUrl
        res.status(200).send(videoId)
        return
    }
    if(videoId && newName.length > 40 ){
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
    res.status(404).send({
        "errorsMessages": [
            {
                "message": "string",
                "field": "string"
            }
        ],
        "resultCode": 0
    })
    return;
})

bloggers_01_Router.delete('/api/bloggers/:id',(req: Request, res: Response) => {
    const bloggerDeleteId = +req.params.id
    const newBloggers = bloggers.filter(v=>v.id !== bloggerDeleteId)
    if(newBloggers.length === bloggers.length){
        res.status(204)
        return
    }
    res.status(204).send(newBloggers)
})
