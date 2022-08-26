
import {Router} from "express";
import {
    validationContent, validationError,
    validationErrorCreatePosts, validationName15,
    validationShortDescription,
    validationTitle, validationYoutubeUrl
} from "../../validation/validation";
import { authorizationMiddleware03 } from "../authorization-middleware06/authorization-middleware03";
import {container} from "../composition-root";
import {BloggerController} from "../controller/controller-bloggers";


// const bloggerController = ioc.getInstance<BloggerController>(BloggerController)
// const bloggerController = container.resolve<BloggerController>(BloggerController)
const bloggerController = container.resolve(BloggerController)

export const RouterBloggers07 =  Router({})

RouterBloggers07.get('/',
    bloggerController.getBloggers.bind(bloggerController))
RouterBloggers07.get('/:id',
    bloggerController.getBloggerId.bind(bloggerController))
RouterBloggers07.get('/:idBloggers/posts',
    bloggerController.getBloggerIdPosts.bind(bloggerController))
RouterBloggers07.post('/:idBlogger/posts',
    authorizationMiddleware03,
    validationTitle,
    validationShortDescription,
    validationContent,
    validationErrorCreatePosts,
    bloggerController.createBloggerIdPosts.bind(bloggerController))
RouterBloggers07.post('/',
    authorizationMiddleware03,
    validationName15,
    validationYoutubeUrl,
    validationError,
    bloggerController.createBlogger.bind(bloggerController))
RouterBloggers07.put('/:id',
    authorizationMiddleware03,
    validationName15,
    validationYoutubeUrl,
    validationError,
    bloggerController.updateBloggerId.bind(bloggerController))
RouterBloggers07.delete('/:id',
    authorizationMiddleware03,
    bloggerController.deleteBloggerId.bind(bloggerController))
