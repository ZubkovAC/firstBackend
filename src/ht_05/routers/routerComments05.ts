import {Request, Response, Router} from "express";
import {
    validationContent20_300, validationErrorCreatePosts,
    validatorAccessUserCommentId,
    validatorFindCommentId
} from "../../validation/validation";
import {serviceComments04} from "../service/service-comments";
import {authorizationMiddleware05} from "../authorization-middleware05/authorization-middleware05";

export const RouterComments05 = Router({})

RouterComments05.get('/:id',
    validatorFindCommentId,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const statusRemovePostId = await serviceComments04.getComments(id)
        res.status(200).send(statusRemovePostId)
        return;
    })
RouterComments05.put('/:id',
    authorizationMiddleware05,
    validationContent20_300,
    validatorFindCommentId,
    validatorAccessUserCommentId,
    validationErrorCreatePosts,
    async (req: Request, res: Response) => {
        const idComment = req.params.id
        const updateComment = await serviceComments04.updateComments(idComment,req.body.content)
        res.send(204)
        return;
    })
RouterComments05.delete('/:id',
    authorizationMiddleware05,
    validatorFindCommentId,
    validatorAccessUserCommentId,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const statusRemovePostId = await serviceComments04.deleteComments(id)
        res.send(204)
        return;
    })
