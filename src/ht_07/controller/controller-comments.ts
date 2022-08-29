import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {CommentsService} from "../service/service-comments";
var jwt = require('jsonwebtoken')

@injectable()
export class CommentsController {
    constructor(@inject(CommentsService) protected commentsService:CommentsService) {
    }
    async getCommentsId (req: Request, res: Response){
        const id = req.params.id
        const statusRemovePostId = await this.commentsService.getComments(id)
        res.status(200).send(statusRemovePostId)
        return;
    }
    async updateCommentsId (req: Request, res: Response){
        const idComment = req.params.id
        const updateComment = await this.commentsService.updateComments(idComment,req.body.content)
        res.send(204)
        return;
    }
    async updateCommentsIdLikeStatus (req: Request, res: Response){
        const idComment = req.params.id
        const token = req.headers.authorization.split(" ")[1]
        const {login, userId } = await jwt.verify(token,process.env.SECRET_KEY)
        const updateComment = await this.commentsService.updateCommentsLikeStatus(idComment,req.body.likeStatus,userId,login)
        res.send(204)
        return;
    }
    async deleteCommentsId (req: Request, res: Response){
        const id = req.params.id
        const statusRemovePostId = await this.commentsService.deleteComments(id)
        res.send(204)
        return;
    }
}
