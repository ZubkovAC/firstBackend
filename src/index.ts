import {productsRouter} from "./routes/products-router";
import {addressesRouter} from "./routes/addresses-router";
import {videosRouter} from "./routes/videos-router";
import {lesson_01_Router} from "./routes/lesson_01";
import {bloggers_01_Router} from "./routes/blogers_01";
import {posts_01_Router} from "./routes/posts_01";


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
app.use('/hs_01',posts_01_Router)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
