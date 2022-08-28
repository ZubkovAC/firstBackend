import {Router} from "express";
import {
        bloggersCollectionModel,
        commentsCollectionModel,
        countRequestEmailResendingModel,
        countRequestLoginModel,
        countRequestRegistrationModel,
        countRequestRegistrationConformationModel,
        postsCollectionModel, userRegistrationModel
} from "../db";

export const RouterTesting07 = Router({})

RouterTesting07.delete("/all-data",
    async (req, res) => {
        await  bloggersCollectionModel.deleteMany({})
        await  postsCollectionModel.deleteMany({})
        await  commentsCollectionModel.deleteMany({})
        await  countRequestLoginModel.deleteMany({})
        await  countRequestRegistrationModel.deleteMany({})
        await  countRequestEmailResendingModel.deleteMany({})
        await  countRequestRegistrationConformationModel.deleteMany({})
        await  userRegistrationModel.deleteMany({})
        res.send(204)
        return
    })