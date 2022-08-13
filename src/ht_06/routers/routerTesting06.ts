import {Router} from "express";
import {
        bloggersCollection06,
        commentsCollection06,
        countRequestEmailResending06,
        countRequestLogin06,
        countRequestRegistration06,
        countRequestRegistrationConformation06,
        postsCollection06, registrationToken06,
        usersCollection06
} from "../db";

export const RouterTesting06 = Router({})

RouterTesting06.delete("/all-data",
    async (req, res) => {
        await  bloggersCollection06.deleteMany({})
        await  postsCollection06.deleteMany({})
        await  usersCollection06.deleteMany({})
        await  commentsCollection06.deleteMany({})
        await  countRequestLogin06.deleteMany({})
        await  countRequestRegistration06.deleteMany({})
        await  countRequestEmailResending06.deleteMany({})
        await  countRequestRegistrationConformation06.deleteMany({})
        await  registrationToken06.deleteMany({})
        res.send(204)
        return
    })