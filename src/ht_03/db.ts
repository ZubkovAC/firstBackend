import {MongoClient} from 'mongodb'

export type BloggersType = {
    id:number
    name:string
    youtubeUrl:string
}
export type PostsType = {
    "id": number
    "title": string
    "shortDescription": string
    "content": string
    "bloggerId": number
    "bloggerName": string
}

// const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'
// const mongoUri = "mongodb+srv://ZybkovAC:KalxotXic2bEZh4R@cluster0.ywntv.mongodb.net/expample?retryWrites=true&w=majority" || 'mongodb://0.0.0.0:27017'
const mongoUri = "mongodb+srv://ZybkovAC:u2fvwZGQ60wsUru2@cluster0.ywntv.mongodb.net/expample" || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri)

// let db = client.db('video');
let db = client.db('expample');
export const bloggersCollection = db.collection<BloggersType>('bloggers')
export const postsCollection = db.collection<PostsType>('posts')

export async function runDb(){
    try{
        await client.connect()
        // await client.db('videos').command({ping:1})
        await client.db('expample').command({ping:1})
        console.log('Connect successfully to Mongo server')
        console.log('соедениние установлено')
    }catch {
        console.log('Can"t connect to db')
        await client.close()
    }
}
