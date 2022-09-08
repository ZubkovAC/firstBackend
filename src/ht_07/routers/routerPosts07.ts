import {Router} from "express";
import {
    validationBloggerId, validationBloggerIdUpdate,
    validationContent,
    validationContent20_300, validationError,
    validationErrorCreatePosts,
    validationErrorUpdatePosts, validationFindBlogger, validationLikeStatus,
    validationPostId, validationSaveUserId,
    validationShortDescription,
    validationTitle,
    validatorPostIdComments
} from "../../validation/validation";
import {authorizationMiddleware06} from "../authorization-middleware06/authorization-middleware06";
import {authorizationMiddleware03} from "../authorization-middleware06/authorization-middleware03";
import {container} from "../composition-root";
import {PostsController} from "../controller/controller-posts";

const postsController = container.resolve(PostsController)
export const RouterPosts07 = Router({})

RouterPosts07.get('',
         validationSaveUserId,
         postsController.getPosts.bind(postsController)
)
RouterPosts07.get('/:id',
        validationPostId,
        validationErrorUpdatePosts,
        validationSaveUserId,
        postsController.getPostId.bind(postsController)
)
RouterPosts07.get('/:id/comments',
        validatorPostIdComments,
        postsController.getPostsIdComments.bind(postsController)
)
RouterPosts07.post('/:id/comments',
    authorizationMiddleware06,
    validationContent20_300,
    validationErrorCreatePosts,
    validationPostId,
    validationErrorUpdatePosts,
    postsController.createPostsIdComments.bind(postsController)
)
RouterPosts07.post('/',
    authorizationMiddleware03,
    validationShortDescription,
    validationTitle,
    validationContent,
    validationErrorCreatePosts,
    validationFindBlogger,
    postsController.createPosts.bind(postsController)
)
RouterPosts07.put('/:id',
    authorizationMiddleware03,
    validationShortDescription,
    validationTitle,
    validationContent,
    validationPostId,
    validationBloggerIdUpdate,
    validationErrorUpdatePosts,
    postsController.updatePostId.bind(postsController)
)
RouterPosts07.put('/:id/like-status',
    authorizationMiddleware06,
    validationLikeStatus,
    validationPostId,
    validationErrorUpdatePosts,
    postsController.likeStatus.bind(postsController)
)
RouterPosts07.delete('/:id',
    authorizationMiddleware03,
    postsController.deletePostId.bind(postsController)
)

