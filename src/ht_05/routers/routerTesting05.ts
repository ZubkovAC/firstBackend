import {Router} from "express";
import {
        bloggersCollection,
        commentsCollection,
        postsCollection,
        usersCollection
} from "../db";

export const RouterTesting05 = Router({})

RouterTesting05.delete("/all-data",
    async (req, res) => {
        await  bloggersCollection.drop ()
        await  postsCollection.drop ()
        await  usersCollection.drop ()
        await  commentsCollection.drop ()
        res.send(204)
        return
    })