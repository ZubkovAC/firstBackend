import {Request, Response, Router} from "express";
import {bloggersServiceDb04} from "../service/service-bloggers";
import {
    validationContent, validationError,
    validationErrorCreatePosts, validationName15,
    validationShortDescription,
    validationTitle, validationYoutubeUrl
} from "../../validation/validation";
import {postsService04} from "../service/service-posts";
import { authorizationMiddleware03 } from "../authorization-middleware06/authorization-middleware03";

export const RouterBloggers06 =  Router({})

const pageNumber = (pageNum :string) => pageNum ? +pageNum : 1
const pageSize = (pageSiz :string) => pageSiz ? +pageSiz : 10
const searchNameTerm = (searchName :string) => searchName ? searchName : ''

RouterBloggers06.get('/',
    async (req: Request, res: Response) => {
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const searchNT = searchNameTerm(req.query.SearchNameTerm as string)
        const bloggers = await bloggersServiceDb04.findBloggers(pageN,pageS,searchNT)
        res.status(200).send(bloggers)
    })
RouterBloggers06.get('/:id',async (req: Request, res: Response) => {
    const bloggers = await bloggersServiceDb04.findBloggerId(req.params.id)
    if(bloggers){
        res.status(200).send(bloggers)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return
})
RouterBloggers06.get('/:idBloggers/posts',async (req: Request, res: Response) => {
    const pageN = pageNumber(req.query.PageNumber as string)
    const pageS = pageSize(req.query.PageSize as string)
    const bloggers = await bloggersServiceDb04.findIdBloggerPosts(pageN, pageS,req.params.idBloggers)
    if(bloggers){
        res.status(200).send(bloggers)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return
})
RouterBloggers06.post('/:idBlogger/posts',
    authorizationMiddleware03,
    validationTitle,
    validationShortDescription,
    validationContent,
    validationErrorCreatePosts,
    async (req: Request, res: Response) => {
        const postsBlogger = await postsService04.createBloggerIdPost(req.body.title, req.body.shortDescription,req.body.content,req.params.idBlogger)
        if(postsBlogger.status === 201){
            res.status(201).send(postsBlogger.newPost)
            return
        }
        res.status(404).send("If video for passed id doesn't exist")
        return
    })
RouterBloggers06.post('/',
    authorizationMiddleware03,
    validationName15,
    validationYoutubeUrl,
    validationError,
    async (req: Request, res: Response) => {
        let name = req.body.name.trim()
        let youtubeUrl = req.body.youtubeUrl.trim()
        const createBlogger = await bloggersServiceDb04.createBlogger(name,youtubeUrl)
        res.status(201).send(createBlogger)
    })
RouterBloggers06.put('/:id',
    authorizationMiddleware03,
    validationName15,
    validationYoutubeUrl,
    validationError,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const newName = req.body.name
        const newYoutubeUrl = req.body.youtubeUrl
        const updateBlogger = await bloggersServiceDb04.updateBlogger(id,newName,newYoutubeUrl)
        if(updateBlogger.error === 204){
            res.status(204).send(updateBlogger.newBloggerId)
            return
        }
        if(updateBlogger.error === 404){
            res.send(404)
            return
        }
    })
RouterBloggers06.delete('/:id',
    authorizationMiddleware03,
    async (req: Request, res: Response) => {
        const bloggerDeleteId = req.params.id
        const removeBlogger = await bloggersServiceDb04.removeBloggerId(bloggerDeleteId)
        if(removeBlogger){
            res.send(204)
            return
        }
        res.send(404)
        return;
    })
