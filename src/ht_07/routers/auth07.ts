import {Request, Response, Router} from "express";
import {
    validationEmail, validationEmailPattern,
    validationError, validationFindAndCheckCode,
    validationFindEmail, validationFindLogin, validationFindUser,
    validationLogin3_10, validationLogout, validationNoFindEmail,
    validationPassword6_20, validationRefreshToken, validatorCounterRequest5,
    validatorRequest5
} from "../../validation/validation";
var jwt = require('jsonwebtoken')
import {container} from "../composition-root";
import {AuthController} from "../controller/controller-auth";
const bcrypt = require('bcrypt')

export const RouterAuth07 = Router({})

export const dateExpired={
    "0":"0sec",
    '1':'1sec',
    '10sec':'10sec',
    '15sec':'15sec',
    '20sec':'20sec',
    '1h':'1h',
    '2h':'2h'
}

const authController = container.resolve(AuthController)

RouterAuth07.post("/registration-confirmation",
    validatorRequest5,
    validatorCounterRequest5,
    validationFindAndCheckCode,
    authController.registrationConfirmation.bind(authController)
)

RouterAuth07.post("/registration",
    validatorRequest5,
    validatorCounterRequest5,
    validationLogin3_10,
    validationPassword6_20,
    validationEmail,
    validationError,
    validationEmailPattern,
    validationFindEmail,
    validationFindLogin,
    authController.registration.bind(authController)
)
RouterAuth07.post("/registration-email-resending",
    validatorRequest5,
    validatorCounterRequest5,
    validationEmailPattern,
    validationNoFindEmail,
    authController.registrationEmailResending.bind(authController)
)
RouterAuth07.post('/login',
    validatorRequest5,
    validatorCounterRequest5,
    validationFindUser,
    authController.login.bind(authController)
)

RouterAuth07.post('/refresh-token',
    validationRefreshToken,
    authController.refreshToken.bind(authController)
)

RouterAuth07.post('/logout',
    validationLogout,
    authController.logout.bind(authController)
)
RouterAuth07.get('/me',
    authController.me.bind(authController)
)
