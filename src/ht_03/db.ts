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

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri)

let db = client.db('video');
export const bloggersCollection = db.collection<BloggersType>('bloggers')
export const postsCollection = db.collection<PostsType>('posts')

export async function runDb(){
    try{
        await client.connect()
        await client.db('video').command({ping:1})
        console.log('Connect successfully to Mongo server')
    }catch {
        console.log('Can"t connect to db')
        await client.close()
    }
}