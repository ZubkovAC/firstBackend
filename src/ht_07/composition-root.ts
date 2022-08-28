import 'reflect-metadata'
import {BloggersService07} from "./service/service-bloggers";
import {BloggerRepositoryDB07} from "./repositories/bloggers-repositories07";
import {BloggerController} from "./controller/controller-bloggers";
import {Container} from "inversify";
import {PostsController} from "./controller/controller-posts";
import {PostsService} from "./service/service-posts";
import {PostsRepositories} from "./repositories/posts-repositories07";
import {UserController} from "./controller/controller-users";
import {UserService} from "./service/service-user";
import {UsersRepositories} from "./repositories/users-repositories07";
import {CommentsController} from "./controller/controller-comments";
import {CommentsService} from "./service/service-comments";
import {CommentsRepositories} from "./repositories/comments-repositories07";
import {AuthController} from "./controller/controller-auth";
import {AuthService} from "./service/service-auth";
import {LikesRepositories} from "./repositories/likes-repositories";
import {LikesService} from "./service/likes-service";

// bloggers
export const container = new Container();
container.bind<BloggerController>(BloggerController).to(BloggerController);
container.bind(BloggersService07).to(BloggersService07);
container.bind<BloggerRepositoryDB07>(BloggerRepositoryDB07).to(BloggerRepositoryDB07);

// posts
container.bind<PostsController>(PostsController).to(PostsController);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsRepositories>(PostsRepositories).to(PostsRepositories);

// users
container.bind<UserController>(UserController).to(UserController);
container.bind<UserService>(UserService).to(UserService);
container.bind<UsersRepositories>(UsersRepositories).to(UsersRepositories);
// comments
container.bind<CommentsController>(CommentsController).to(CommentsController);
container.bind<CommentsService>(CommentsService).to(CommentsService);
container.bind<CommentsRepositories>(CommentsRepositories).to(CommentsRepositories);
// auth
container.bind<AuthController>(AuthController).to(AuthController);
container.bind<AuthService>(AuthService).to(AuthService);
// container.bind<CommentsRepositories>(CommentsRepositories).to(CommentsRepositories);
// likes
container.bind<LikesRepositories>(LikesRepositories).to(LikesRepositories)
container.bind<LikesService>(LikesService).to(LikesService)