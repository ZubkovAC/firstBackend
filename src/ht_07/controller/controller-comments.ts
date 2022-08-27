import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {CommentsService} from "../service/service-comments";

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
    async deleteCommentsId (req: Request, res: Response){
        const id = req.params.id
        const statusRemovePostId = await this.commentsService.deleteComments(id)
        res.send(204)
        return;
    }
}
