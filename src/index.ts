require('dotenv').config()
import {productsRouter} from "./routes/products-router";
import {addressesRouter} from "./routes/addresses-router";
import {videosRouter} from "./routes/videos-router";
import {lesson_01_Router} from "./routes/lesson_01";
import {bloggers_01_Router} from "./routes/blogers_01";
import {hs_01_Router} from "./hs_01v2/hs_01/hs_01";
import {ht_02_Router} from "./ht_02/ht_02";
import {ht_03_Router} from "./ht_03/ht_03";
import {ht_04_Router} from "./ht_04/ht_04";
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
const port = process.env.PORT || 5000


app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    let helloWorldWORLD11 = 'Hello World! WORLD!'
    res.send(helloWorldWORLD11)
})

app.use('/videos',videosRouter)
app.use('/products',productsRouter)
app.use('/addresses',addressesRouter)

app.use('/lesson_01',lesson_01_Router)
app.use('/hs_01',bloggers_01_Router)
app.use('/hs_01v2',hs_01_Router)
app.use('/ht_02',ht_02_Router)
app.use('/ht_03',ht_03_Router)
app.use('/ht_04',ht_04_Router)
// ht_06
app.use('/ht_06/api/auth',RouterAuth06)
app.use('/ht_06/api/bloggers',RouterBloggers06)
app.use('/ht_06/api/comments',RouterComments06)
app.use('/ht_06/api/posts',RouterPosts06)
app.use('/ht_06/api/testing',RouterTesting06)
app.use('/ht_06/api/users',RouterUsers06)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()


