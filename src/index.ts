import { Request,Response} from 'express'
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]

const app = express()
const port = 5000

app.use(cors())
app.use(bodyParser.json({type: 'application/*+json'}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    let helloWorldWORLD11 = 'Hello World! WORLD!';
    res.send(helloWorldWORLD11)
})
app.get('/videos', (req, res) => {
    res.send(videos)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id)
    if (video) {
        res.send(video)
        return
    }
    res.send(404)

})
app.post('/videos', (req: Request, res: Response) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'it-incubator.eu'
    }
    videos.push(newVideo)
    res.send(newVideo)
})
app.delete('/videos/:id', (req: Request, res: Response) => {

    const newVideos = videos.filter(v => v.id !== +req.params.id)
    if (newVideos.length < videos.length) {
        res.send(newVideos)
        return
    }
    res.send(404)
})
app.put('/videos/:id',(req: Request, res: Response)=>{
        const id  = +req.params.id
        const findVideo = videos.find(v=> v.id === id)
         if(findVideo){
            findVideo.title = req.body.title
            res.send(videos)
        }else {
            res.send(404)
        }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
