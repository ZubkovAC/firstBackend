import {BloggersService07} from "../service/service-bloggers";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import { PostsService } from "../service/service-posts";
var jwt = require('jsonwebtoken')


const pageNumber = (pageNum :string) => pageNum ? +pageNum : 1
const pageSize = (pageSiz :string) => pageSiz ? +pageSiz : 10
const searchNameTerm = (searchName :string) => searchName ? searchName : ''

@injectable()
export class BloggerController{
    constructor(
                 @inject(BloggersService07)
                protected bloggerService:BloggersService07,
                protected postsService:PostsService
    ) {}
    async getBloggers (req: Request, res: Response){
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const searchNT = searchNameTerm(req.query.SearchNameTerm as string)
        const bloggers = await this.bloggerService.findBloggers(pageN,pageS,searchNT)
        res.status(200).send(bloggers)
    }
    async getBloggerId (req: Request, res: Response){
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const searchNT = searchNameTerm(req.query.SearchNameTerm as string)
        const bloggers = await this.bloggerService.findBloggers(pageN,pageS,searchNT)
        res.status(200).send(bloggers)
    }
    async getBloggerIdPosts(req: Request, res: Response){
        const token = req.headers.authorization?.split(" ")[1]
        let userId = ''
        if(token){
            userId = jwt.verify(token,process.env.SECRET_KEY).userId
        }

        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const bloggers = await this.bloggerService.findIdBloggerPosts(pageN, pageS,req.params.idBloggers , userId)
        if(bloggers){
            res.status(200).send(bloggers)
            return
        }
        res.status(404).send("If video for passed id doesn't exist")
        return
    }
    async createBloggerIdPosts(req: Request, res: Response){
        // const postsBlogger = await this.postsService.createBloggerIdPost(req.body.title, req.body.shortDescription,req.body.content,req.params.idBlogger)
        const postsBlogger = await this.postsService.createBloggerIdPost(req.body.title, req.body.shortDescription,req.body.content,req.params.idBlogger)
            res.status(201).send(postsBlogger)
            return
    }
    async createBlogger(req: Request, res: Response){
        let name = req.body.name.trim()
        let youtubeUrl = req.body.youtubeUrl.trim()
        const createBlogger = await this.bloggerService.createBlogger(name,youtubeUrl)
        res.status(201).send(createBlogger)
    }
    async updateBloggerId(req: Request, res: Response){
        const id = req.params.id
        const newName = req.body.name
        const newYoutubeUrl = req.body.youtubeUrl
        const updateBlogger = await this.bloggerService.updateBlogger(id,newName,newYoutubeUrl)
        if(updateBlogger.error === 204){
            res.status(204).send(updateBlogger.newBloggerId)
            return
        }
        if(updateBlogger.error === 404){
            res.send(404)
            return
        }
    }
    async deleteBloggerId(req: Request, res: Response){
        const bloggerDeleteId = req.params.id
        const removeBlogger = await this.bloggerService.removeBloggerId(bloggerDeleteId)
        if(removeBlogger){
            res.send(204)
            return
        }
        res.send(404)
        return;
    }
}