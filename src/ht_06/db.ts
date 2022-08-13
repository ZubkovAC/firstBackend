import {MongoClient} from 'mongodb'
import mongoose from 'mongoose'
import {BloggersType,PostsType,UsersType,CommentsType,CountRequestType,RegistrationTokenType} from "./types";

const mongoUri = process.env.MONGO_DB || 'mongodb://0.0.0.0:27017'


const kittySchema = new mongoose.Schema({
    name: String
});

export const secret = {
    key : process.env.SECRET_KEY || '123'
}

export const client = new MongoClient(mongoUri)

export let db = client.db('expample');
export const bloggersCollection = db.collection<BloggersType>('bloggers')
export const postsCollection = db.collection<PostsType>('posts')
export const usersCollection = db.collection<UsersType>('users')
export const commentsCollection = db.collection<CommentsType>('comments')
export const registrationToken = db.collection<RegistrationTokenType>('registrationToken')
//from 429 auth
export const countRequestLogin = db.collection<CountRequestType>('countRequestLogin')
export const countRequestRegistration = db.collection<CountRequestType>('countRequestRegistration')
export const countRequestEmailResending = db.collection<CountRequestType>('countRequestEmailResending')
export const countRequestRegistrationConformation = db.collection<CountRequestType>('countRequestRegistrationConformation')



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

