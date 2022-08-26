import {BloggersService07} from "./service/service-bloggers";
import {BloggerRepositoryDB07} from "./repositories/bloggers-repositories07";
import {BloggerController} from "./controller/controller-bloggers";


const bloggerRepository = new BloggerRepositoryDB07()
const bloggerService = new BloggersService07(bloggerRepository)

export const bloggerController = new BloggerController(bloggerService)