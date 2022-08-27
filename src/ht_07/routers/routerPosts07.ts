import {Router} from "express";
import {
    validationBloggerId,
    validationContent,
    validationContent20_300,
    validationErrorCreatePosts,
    validationErrorUpdatePosts,
    validationPostId,
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
         postsController.getPosts.bind(postsController)
)
RouterPosts07.get('/:id',
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
    postsController.createPosts.bind(postsController)
)
RouterPosts07.put('/:id',
    authorizationMiddleware03,
    validationShortDescription,
    validationTitle,
    validationContent,
    validationPostId,
    validationBloggerId,
    validationErrorUpdatePosts,
    postsController.updatePostId.bind(postsController)
)
RouterPosts07.delete('/:id',
    authorizationMiddleware03,
    postsController.deletePostId.bind(postsController)
)
