import {MongoClient} from 'mongodb'

export type BloggersType = {
    id:string
    name:string
    youtubeUrl:string
}
export type PostsType = {
    "id": string
    "title": string
    "shortDescription": string
    "content": string
    "bloggerId": string
    "bloggerName": string
}
export type UsersType = {
    "id": string
    login:string
    password:string
}
export type CommentsType = {
    idPostComment :string
    "id": string
    "content": string
    "userId": string
    "userLogin": string
    "addedAt": string
}

export type CountRequestType = {
    ip:string
    date:Date
}
export type RegistrationTokenType = {
    accountData:{
        id:string
        login:string
        email:string
        createAt:Date
        passwordHash:string
    }
    emailConformation:{
        conformationCode:string
        expirationDate:Date
        isConfirmed:boolean
    }
}
const mongoUri = process.env.MONGO_DB || 'mongodb://0.0.0.0:27017'

export const secret = {
    key : process.env.SECRET_KEY || '123'
}

export const client = new MongoClient(mongoUri)

// let db = client.db('video');
let db = client.db('expample');
export const bloggersCollection = db.collection<BloggersType>('bloggers')
export const postsCollection = db.collection<PostsType>('posts')
export const usersCollection = db.collection<UsersType>('users')
export const commentsCollection = db.collection<CommentsType>('comments')
export const countRequest = db.collection<CountRequestType>('countRequest')
export const registrationToken = db.collection<RegistrationTokenType>('registrationToken')

export const createCommentsCollection = db.collection<any>('createComments')
export const deleteCommentsCollection = db.collection<any>('deleteComments')

export async function runDb(){
    try{
        await client.connect()
        // await client.db('videos').command({ping:1})
        await client.db('expample').command({ping:1})
        console.log('соедениние установлено')
    }catch {
        console.log('Ошибка соединения')
        await client.close()
    }
}

