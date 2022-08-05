import {Router} from "express";

export const RouterTesting05 = Router({})

RouterTesting05.delete("/all-data",
    async (req, res) => {
        res.send('all-data')
        return

    })