import {Router} from "express";
import {
    validationContent20_300, validationErrorCreatePosts, validationLikeStatus,
    validatorAccessUserCommentId,
    validatorFindCommentId
} from "../../validation/validation";
import {authorizationMiddleware06} from "../authorization-middleware06/authorization-middleware06";
import {CommentsController} from "../controller/controller-comments";
import {container} from "../composition-root";

const commentsController = container.resolve(CommentsController)
export const RouterComments07 = Router({})

RouterComments07.get('/:id',
    validatorFindCommentId,
    commentsController.getCommentsId.bind(commentsController)
)
RouterComments07.put('/:id',
    authorizationMiddleware06,
    validationContent20_300,
    validatorFindCommentId,
    validatorAccessUserCommentId,
    validationErrorCreatePosts,
    commentsController.updateCommentsId.bind(commentsController)
)
RouterComments07.put('/:id/like-status',
    authorizationMiddleware06,
    // validationContent20_300,
    validatorFindCommentId,
    validatorAccessUserCommentId,
    validationErrorCreatePosts,
    validationLikeStatus,
    commentsController.updateCommentsIdLikeStatus.bind(commentsController)
)
RouterComments07.delete('/:id',
    authorizationMiddleware06,
    validatorFindCommentId,
    validatorAccessUserCommentId,
    commentsController.deleteCommentsId.bind(commentsController)
)
