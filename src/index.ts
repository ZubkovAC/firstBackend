import {ObjectId} from "mongodb";

require('dotenv').config()
var cookieParser = require('cookie-parser')
import {runDb} from "./ht_07/db";
import {RouterAuth07} from "./ht_07/routers/auth07";
import {RouterBloggers07} from "./ht_07/routers/routerBloggers07";
import {RouterPosts07} from "./ht_07/routers/routerPosts07";
import {RouterComments07} from "./ht_07/routers/routerComments07";
import { RouterUsers07 } from "./ht_07/routers/routerUsers07";
import { RouterTesting07 } from "./ht_07/routers/routerTesting07";

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
// app.use('/ht_06/api/bloggers',RouterBloggers06)
// app.use('/ht_06/api/posts',RouterPosts06)
//
// app.use('/ht_06/api/auth',RouterAuth06)
// app.use('/ht_06/api/comments',RouterComments06)
// app.use('/ht_06/api/testing',RouterTesting06)
// app.use('/ht_06/api/users',RouterUsers06)


app.use('/ht_07/api/bloggers',RouterBloggers07)
app.use('/ht_07/api/posts',RouterPosts07)

app.use('/ht_07/api/testing',RouterTesting07)
app.use('/ht_07/api/users',RouterUsers07)
app.use('/ht_07/api/comments',RouterComments07)

app.use('/ht_07/api/auth',RouterAuth07)




