import {Request, Response, Router} from "express";

export const lesson_01_Router = Router({})

let videosLesson01 = [
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

lesson_01_Router.get('/api/videos', (req: Request, res: Response) => {
    res.status(201).send(videosLesson01)
})

lesson_01_Router.post('/api/videos', (req: Request, res: Response) => {

    let title = req.body.title !== null ? req.body.title : 1

    if (!title && title?.trim() || typeof title !== 'string' || title.length > 40) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "If the inputModel has incorrect values",
                    "field": "string"
                }
            ]
            // , resultCode: 1
        })
        return;
    }

    const newVideo = {
        "id": videosLesson01.length +2,
        "title": title,
        "author": "Peter Farrelly-moc"
    }
    videosLesson01.push(newVideo)
    res.status(201).send(newVideo)
    return
})


lesson_01_Router.get('/api/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const videoId = videosLesson01.find(v => v.id === id)
    if (videoId) {
        res.status(200).send(videoId)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
})

lesson_01_Router.put('/api/videos/:id', (req: Request, res: Response) => {

    let title = req.body.title !== null ? req.body.title : 1

    if (!title && title?.trim() || typeof req.body.title !== 'string' || title.length > 40) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "If the inputModel has incorrect values",
                    "field": "string"
                }
            ]
            // , resultCode: 1
        })
        return;
    }

    const id = +req.params.id
    const videoId = videosLesson01.find(v => v.id === id)
    if (videoId) {
        videoId.title = title
        res.send(204)
    }else{
        res.send(404)
    }
})

lesson_01_Router.delete('/api/videos/:id', (req: Request, res: Response) => {
    let videoDeleteId = +req.params.id
    let newVideo = videosLesson01.filter(v => v.id !== videoDeleteId)
    if (newVideo.length < videosLesson01.length) {
        videosLesson01 = newVideo
        res.send(204)
    }else{
        // res.status(404).send(newVideo)
        res.send(404)
    }

})
lesson_01_Router.delete('/api/videos/', (req: Request, res: Response) => {
        videosLesson01 = []
        res.send(204)
})
