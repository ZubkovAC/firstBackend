import {productsRouter} from "./routes/products-router";
import {addressesRouter} from "./routes/addresses-router";
import {videosRouter} from "./routes/videos-router";
import {lesson_01_Router} from "./routes/lesson_01";
import {bloggers_01_Router} from "./routes/blogers_01";
import {hs_01_Router} from "./hs_01v2/hs_01/hs_01";
import {ht_02_Router} from "./ht_02/ht_02";
import {ht_03_Router} from "./ht_03/ht_03";


const express = require('express')
const cors = require('cors')
// const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
// app.use(bodyParser)

app.use(express.json())
// app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    let helloWorldWORLD11 = 'Hello World! WORLD!';
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

const startApp =  () => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()


