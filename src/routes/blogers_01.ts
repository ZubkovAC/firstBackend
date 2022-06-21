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

    let name = req.body.name?.trim() ? req.body.name.trim() : ''

    let youtubeUrl = req.body.youtubeUrl.trim()

    // let expression = "/^https:\\/\\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$/"
    let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
    let regex = new RegExp(expression);

    let validateUrl = false
    if (youtubeUrl.match(regex)) {
        validateUrl = false
        console.log('false')
    } else {
        validateUrl = true
        console.log('true')
    }
    if(validateUrl || !name || name.length > 15 || youtubeUrl.length > 100){
        const errorsMessages =[]
        if(validateUrl || youtubeUrl.length > 100){
            errorsMessages.push({
                message: "non validation url",
                field: "youtubeUrl"
            })
        } if(name.length > 15 || !name){
            errorsMessages.push({
                message: "non validation name ",
                field: "name"
            })
        }
        res.status(400).send({"errorsMessages": errorsMessages})
        return;
    }

    if(name.length <= 15 && youtubeUrl.length < 101){
        const newVideo = {
            "id": bloggers.length+1,
            "name":req.body.name,
            "youtubeUrl": youtubeUrl
        }
        bloggers.push(newVideo)
        res.status(201).send(newVideo)
        return
    }
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
    const newName = req.body.name?.trim() ?  req.body.name.trim() : ''
    const newYoutubeUrl = req.body.youtubeUrl.trim()
    const videoId = bloggers.find(v=>v.id === id)

    // let expression = '/^https:\/\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/'
    let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
    let regex = new RegExp(expression);
    let validateUrl = false
    if (newYoutubeUrl.match(regex)) {
        validateUrl = false
    } else {
        validateUrl = true
    }
    if(validateUrl || newName.trim()?.length > 15 || !newName || newYoutubeUrl.length > 100){
        const errorsMessages =[]
        if(validateUrl || newYoutubeUrl.length > 100){
            errorsMessages.push({
                message: "non validation url",
                field: "youtubeUrl"
            })
        } if(newName.length > 15 || !newName.trim()){
            errorsMessages.push({
                message: "non validation name ",
                field: "name"
            })
        }
        res.status(400).send({"errorsMessages": errorsMessages})
        return;
    }
    if(videoId && newName.length <= 15 && newYoutubeUrl.length <= 100 ){
        videoId.name = newName
        videoId.youtubeUrl = newYoutubeUrl
        res.status(204).send(videoId)
        return
    }
    if(!videoId){
        res.send(404)
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
    if(!req.body.shortDescription || !req.body.title || !req.body.content || req.body.title?.length > 30 || req.body.shortDescription?.length > 100 || req.body.content?.length > 1000){
        const errorsMessages =[]
        if(!req.body.title || req.body.title.length > 30 || !req.body.title){
            errorsMessages.push({message: "If the inputModel has incorrect title", field: "title"})
        }if(!req.body.shortDescription ||  req.body.shortDescription.length > 100 || !req.body.shortDescription){
            errorsMessages.push({message: "If the inputModel has incorrect shortDescription", field: "shortDescription"})
        }if( !req.body.content || req.body.content > 1000 || !req.body.content){
            errorsMessages.push({message: "max bloggerId 1000 ", field: "content"})
        }
        res.status(400).send({errorsMessages:errorsMessages})
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

    if(!req.body.shortDescription || !req.body.title || !req.body.content || req.body.title?.length > 30 || req.body.shortDescription?.length > 100 || req.body.content?.length > 1000){
        const errorsMessages =[]
        if(!req.body.title || req.body.title.length > 30 || !req.body.title){
            errorsMessages.push({ message: "incorrect value title", field: "title" })
        }if(!req.body.shortDescription ||  req.body.shortDescription.length > 100 || !req.body.shortDescription){
            errorsMessages.push({ message: "incorrect value shortDescription", field: "shortDescription" })
        }if( !req.body.content || req.body.content?.length > 1000 || !req.body.content ){
            errorsMessages.push({ message: "max id 1000 bloggerId", field: "content" })
        }
        res.status(400).send({"errorsMessages": errorsMessages})
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
        posts = newPosts
        res.send(204)
        return
    }
    res.send(404)
    return;
})
