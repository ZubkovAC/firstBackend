import {Router} from "express";
import {authorizationMiddleware03} from "../authorization-middleware06/authorization-middleware03";
import {
    validationEmail,
    validationErrorCreatePosts,
    validationLogin3_10,
    validationPassword6_20
} from "../../validation/validation";
import {UserController} from "../controller/controller-users";
import {container} from "../composition-root";

const userController = container.resolve(UserController)
export const RouterUsers07 = Router({})

RouterUsers07.get('/',
    userController.getUsers.bind(userController)
)
RouterUsers07.post('/',
    authorizationMiddleware03,
    validationLogin3_10,
    validationPassword6_20,
    validationEmail,
    validationErrorCreatePosts,
    userController.createUser.bind(userController)
)

RouterUsers07.delete('/:id',
    authorizationMiddleware03,
    userController.deleteUser.bind(userController)
)
