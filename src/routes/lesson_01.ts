import {Request, Response, Router} from "express";

export const lesson_01_Router = Router({})

    const videosLesson01 = [
        {
        "id": 0,
        "title": "The Green Mile",
        "author": "Frank Darabont"
        },
        {
        "id": 1,
        "title": "Green Book",
        "author": "Peter Farrelly"
        },
    ]

lesson_01_Router.get('/api/videos',(req: Request, res: Response) => {
    res.status(201).send(videosLesson01)
})

lesson_01_Router.post('/api/videos',(req: Request, res: Response) => {
    if( req.body.title.trim() || req.body.title.length <= 40 || typeof req.body.title === 'string'){
        const newVideo = {
            "id": Math.floor(Math.random()*10000) ,
            "title":req.body.title,
            "author": "Peter Farrelly-moc"
        }
        videosLesson01.push(newVideo)
        res.status(200).send(newVideo)
        return
    }
    res.status(400).send({
        "errorsMessages": [
            {
                "message": "string",
                "field": "string"
            }
        ]
    })
})
lesson_01_Router.get('/api/videos/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    const videoId = videosLesson01.find(v=>v.id === id)
    if(videoId){
        res.status(204).send(videoId)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
})

lesson_01_Router.put('/api/videos/:id',(req: Request, res: Response) => {
    const id = +req.params.id
    const newTitle = req.body.title
    const videoId = videosLesson01.find(v=>v.id === id)
    if(videoId && newTitle.length <= 40 || req.body.title.trim() || typeof req.body.title === 'string'){
        videoId.title = newTitle
        res.status(200).send(videoId)
        return
    }
    if(videoId && newTitle.length > 40 ){
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

lesson_01_Router.delete('/api/videos/:id',(req: Request, res: Response) => {
    const videoDeleteId = +req.params.id
    const newVideo = videosLesson01.filter(v=>v.id !== videoDeleteId)
    if(newVideo.length === videosLesson01.length){
        res.status(204)
        return
    }
    res.status(204).send(newVideo)
    return;
})
