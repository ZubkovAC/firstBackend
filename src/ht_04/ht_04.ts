import { Request, Response, Router} from "express";
import {authorizationMiddleware04} from "./authorization-middleware04/authorization-middleware04";
import {
    validationBloggerId,
    validationContent,
    validationError,
    validationErrorCreatePosts,
    validationErrorCreatePostsv2,
    validationErrorUpdatePosts, validationLogin3_10,
    validationName15, validationPassword6_20, validationPostId,
    validationShortDescription,
    validationTitle,
    validationYoutubeUrl
} from "../validation/validation";
import {bloggersServiceDb04} from "./service/service-bloggers";
import {postsService04} from "./service/service-posts";
import {serviceUser04} from "./service/service-user";
import {serviceComments04} from "./service/service-comments";
import {secret, usersCollection} from "./db";
import {authorizationMiddleware03} from "../ht_03/authorization-middleware/authorization-middleware03";
var jwt = require('jsonwebtoken')

export const ht_04_Router = Router({})

export let errorPostId04 =[]
export let errorBloggerId04 =[]

const pageNumber = (pageNum :string) => pageNum ? +pageNum : 1
const pageSize = (pageSiz :string) => pageSiz ? +pageSiz : 10
const searchNameTerm = (searchName :string) => searchName ? searchName : ''

// LOGIN
ht_04_Router.post('/api/auth/login',
    validationLogin3_10,
    validationPassword6_20,
    validationError,
    async (req: Request, res: Response) => {
        // const parse = jwt.verify(test,secret.key)
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        console.log("~~~AUTH~~~~~",login,password)
        const searchLogin = await usersCollection.findOne({login:login})
        if(searchLogin && searchLogin.password === password){
            const token = jwt.sign({id:searchLogin.id},secret.key,{expiresIn:'1h'})
            res.status(200).send({token:token})
            return
        }
        res.status(401).send('If the password or login is wrong')
        return
    })

// BLOGGERS
ht_04_Router.get('/api/bloggers',
    async (req: Request, res: Response) => {
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const searchNT = searchNameTerm(req.query.SearchNameTerm as string)
        const bloggers = await bloggersServiceDb04.findBloggers(pageN,pageS,searchNT)
        res.status(200).send(bloggers)
    })

ht_04_Router.get('/api/bloggers/:id',async (req: Request, res: Response) => {
    const bloggers = await bloggersServiceDb04.findBloggerId(req.params.id)
    if(bloggers){
        res.status(200).send(bloggers)
        return
    }
    res.status(404).send("If video for passed id doesn't exist")
    return
})
ht_04_Router.get('/api/bloggers/:idBloggers/posts',async (req: Request, res: Response) => {
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
ht_04_Router.post('/api/bloggers/:idBlogger/posts',
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

ht_04_Router.post('/api/bloggers',
    authorizationMiddleware03,
    validationName15,
    validationYoutubeUrl,
    validationError,
    async (req: Request, res: Response) => {
        let name = req.body.name.trim()
        let youtubeUrl = req.body.youtubeUrl.trim()
        const createBlogger = await bloggersServiceDb04.createBlogger(name,youtubeUrl)
        res.status(201).send(createBlogger.newBlogger)
    })

ht_04_Router.put('/api/bloggers/:id',
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

ht_04_Router.delete('/api/bloggers/:id',
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

// POSTS
ht_04_Router.get('/api/posts',
    async (req: Request, res: Response) => {
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const posts = await postsService04.findPosts(pageN,pageS)
        res.status(200).send(posts)
    })
ht_04_Router.get('/api/posts/:id',
    async(req: Request, res: Response) => {
        const id = req.params.id
        const post = await postsService04.findPostId(id)
        if(post.status){
            res.status(200).send(post.post)
            return
        }
        res.status(404).send("If video for passed id doesn't exist")
        return;
    })
ht_04_Router.get('/api/posts/:id/comments',
    async(req: Request, res: Response) => {
        const id = req.params.id
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const commentsPost = await serviceComments04.getCommentsPost(id,pageN,pageS)
        // need validation + fix error ( 404, 400 )
        console.log(commentsPost)
        res.status(200).send(commentsPost)
        return;
    })

ht_04_Router.post('/api/posts/:id/comments',
    authorizationMiddleware04,
    validationContent,
    async (req: Request, res: Response) => {
        let content = req.body.content.trim()
        const token = req.headers.authorization
        const postId = req.params.id
        const newComments = await serviceComments04.createCommentsPost(postId,content,token )
        // need fix error (401 , 400 , token )
        console.log("newComments",newComments)
        res.status(201).send(newComments)
    })
ht_04_Router.post('/api/posts',
    authorizationMiddleware03,
    validationShortDescription,
    validationTitle,
    validationContent,
    validationErrorCreatePosts,
    async (req: Request, res: Response) => {
        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        const newPost = await postsService04.createPost(title,shortDescription,content,bloggerId)
        validationErrorCreatePostsv2(req,res,newPost)
        res.status(newPost.status).send(newPost.newPost)
    })

ht_04_Router.put('/api/posts/:id',
    authorizationMiddleware03,
    validationShortDescription,
    validationTitle,
    validationContent,
    validationPostId,
    validationBloggerId,
    validationErrorUpdatePosts,
    async (req: Request, res: Response) => {
        const postId = req.params.id
        let shortDescription = req.body.shortDescription.trim()
        let title = req.body.title.trim()
        let content = req.body.content.trim()
        let bloggerId = req.body.bloggerId
        console.log('put post',postId,bloggerId)
        const updatePostId  = await postsService04.updatePostId(postId,title,content,shortDescription,bloggerId)
        if(updatePostId.status === 204){
            res.send(204)
        }    else {
            res.send(404)
        }
    })

ht_04_Router.delete('/api/posts/:id',
    authorizationMiddleware03,
    async (req: Request, res: Response) => {
        const postDeleteId = req.params.id
        const statusRemovePostId = await postsService04.deletePostId(postDeleteId)
        if(statusRemovePostId){
            res.send(204)
            return
        }
        res.send(404)
        return;
    })

// /*COMMENTS*/
ht_04_Router.get('/api/comments/:id',
    async (req: Request, res: Response) => {
        const id = req.params.id
        const statusRemovePostId = await serviceComments04.getComments(id)
        // need validation / error 404 400
        res.status(200).send(statusRemovePostId)
        return;
    })
ht_04_Router.put('/api/comments/:idComment',
    authorizationMiddleware04,
    async (req: Request, res: Response) => {
        const idComment = req.params.idComment
        const token =req.headers.authorization
        const updateComment = await serviceComments04.updateComments(idComment,req.body.content)
        // need validation/ token / error 404 400
        if(updateComment){
            res.send(204)
            return;
        }
        res.send(404)
        return
    })

ht_04_Router.delete('/api/comments/:id',
    authorizationMiddleware04,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const statusRemovePostId = await serviceComments04.deleteComments(id)
        // need validation - id/ token / error 404 400
        return;
    })
// USERS
ht_04_Router.get('/api/users',
    async (req: Request, res: Response) => {
        const pageN = pageNumber(req.query.PageNumber as string)
        const pageS = pageSize(req.query.PageSize as string)
        const users = await serviceUser04.getUsers(pageN,pageS)
        console.log('getUsers',users)
        res.send(users)
        // need validation - id/ token / error 404 400
        return;
    })
ht_04_Router.post('/api/users',
    authorizationMiddleware03,
    validationLogin3_10,
    validationPassword6_20,
    validationErrorCreatePosts,
    async (req: Request, res: Response) => {
        const login = req.body.login.trim()
        const password = req.body.password.trim()
        const users = await serviceUser04.createUsers(login,password)
        res.status(201).send(users)
        // need validation - id/ token / error 404 400
        return;
    })
ht_04_Router.delete('/api/users/:id',
    authorizationMiddleware03,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const userId = await serviceUser04.findUserId(id)
        if(userId){
            await serviceUser04.deleteUsers(id)
            res.send(204)
            return
        }
        res.send(404)
        // need validation - id/ token / error 404 400
        return;
    })
















