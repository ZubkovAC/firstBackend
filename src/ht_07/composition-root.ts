import 'reflect-metadata'
import {BloggersService07} from "./service/service-bloggers";
import {BloggerRepositoryDB07} from "./repositories/bloggers-repositories07";
import {BloggerController} from "./controller/controller-bloggers";
import {Container} from "inversify";
import {PostsController} from "./controller/controller-posts";
import {PostsService} from "./service/service-posts";
import {PostsRepositories} from "./repositories/posts-repositories07";

// bloggers
export const container = new Container();
container.bind<BloggerController>(BloggerController).to(BloggerController);
container.bind(BloggersService07).to(BloggersService07);
container.bind<BloggerRepositoryDB07>(BloggerRepositoryDB07).to(BloggerRepositoryDB07);

// posts
container.bind<PostsController>(PostsController).to(PostsController);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsRepositories>(PostsRepositories).to(PostsRepositories);


