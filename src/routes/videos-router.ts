import {Request, Response, Router} from "express";

export const videosRouter = Router({})

const videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]


videosRouter.get('', (req, res) => {
    res.send(videos)
})
videosRouter.get('/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id)
    if (video) {
        res.send(video)
        return
    }
    res.send(404)

})
videosRouter.post('', (req: Request, res: Response) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'it-incubator.eu'
    }
    videos.push(newVideo)
    res.send(newVideo)
})

videosRouter.delete('/:id', (req: Request, res: Response) => {

    const newVideos = videos.filter(v => v.id !== +req.params.id)
    if (newVideos.length < videos.length) {
        res.send(newVideos)
        return
    }
    res.send(404)
})
videosRouter.put('/:id', (req: Request, res: Response) => {
    const id = +req.params.id
    const findVideo = videos.find(v => v.id === id)
    if (findVideo) {
        findVideo.title = req.body.title
        res.send(videos)
    } else {
        res.send(404)
    }
})