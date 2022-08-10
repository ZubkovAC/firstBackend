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
import {ht_05_Router} from "./ht_05/ht_05";
// import {runDb} from "./ht_03/db";
// import {runDb} from "./ht_04/db";
import {runDb} from "./ht_05/db";
import {RouterAuth05} from "./ht_05/routers/auth05";
import {RouterBloggers05} from "./ht_05/routers/routerBloggers05";
import {RouterPosts05} from "./ht_05/routers/routerPosts05";
import {RouterComments05} from "./ht_05/routers/routerComments05";
import { RouterTesting05 } from "./ht_05/routers/routerTesting05";
import { RouterUsers05 } from "./ht_05/routers/routerUsers05";

const express = require('express')
const cors = require('cors')
// const bodyParser = require('body-parser')

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
// app.use('/ht_05',ht_05_Router)
app.use('/ht_05/api/auth',RouterAuth05)
app.use('/ht_05/api/bloggers',RouterBloggers05)
app.use('/ht_05/api/comments',RouterComments05)
app.use('/ht_05/api/posts',RouterPosts05)
app.use('/ht_05/api/testing',RouterTesting05)
app.use('/ht_05/api/users',RouterUsers05)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()


