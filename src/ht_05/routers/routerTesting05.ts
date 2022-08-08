import {Router} from "express";
import {
        bloggersCollection,
        commentsCollection,
        countRequestEmailResending,
        countRequestLogin,
        countRequestRegistration,
        countRequestRegistrationConformation, db,
        postsCollection, registrationToken,
        usersCollection
} from "../db";

export const RouterTesting05 = Router({})

RouterTesting05.delete("/all-data",
    async (req, res) => {
        await  bloggersCollection.deleteMany({})
        await  postsCollection.deleteMany({})
        await  usersCollection.deleteMany({})
        await  commentsCollection.deleteMany({})
        await  countRequestLogin.deleteMany({})
        await  countRequestRegistration.deleteMany({})
        await  countRequestEmailResending.deleteMany({})
        await  countRequestRegistrationConformation.deleteMany({})
        await  registrationToken.deleteMany({})
        res.send(204)
        return
    })