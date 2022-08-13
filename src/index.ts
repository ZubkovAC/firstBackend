require('dotenv').config()
var cookieParser = require('cookie-parser')
import {runDb} from "./ht_06/db";
import {RouterAuth06} from "./ht_06/routers/auth06";
import {RouterBloggers06} from "./ht_06/routers/routerBloggers06";
import {RouterPosts06} from "./ht_06/routers/routerPosts06";
import {RouterComments06} from "./ht_06/routers/routerComments06";
import { RouterUsers06 } from "./ht_06/routers/routerUsers06";
import { RouterTesting06 } from "./ht_06/routers/routerTesting06";

const express = require('express')
const cors = require('cors')

const app = express()
app.use(cookieParser())
const port = process.env.PORT || 5000


app.use(cors())

app.use(express.json())


app.get('/', (req, res) => {
    let helloWorldWORLD11 = 'Hello World! WORLD!'
    res.send(helloWorldWORLD11)
})

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()
// ht_06
app.use('/ht_06/api/auth',RouterAuth06)
app.use('/ht_06/api/bloggers',RouterBloggers06)
app.use('/ht_06/api/posts',RouterPosts06)
app.use('/ht_06/api/comments',RouterComments06)
app.use('/ht_06/api/testing',RouterTesting06)
app.use('/ht_06/api/users',RouterUsers06)


