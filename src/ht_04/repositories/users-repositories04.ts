import {secret, usersCollection} from "../db";
// import jwt from 'jsonwebtoken'
var jwt = require('jsonwebtoken')
import { v4 as uuidv4 } from 'uuid'



export const usersRepositories04 ={
    async findUserId(userId:string){
        return await usersCollection.findOne({id:userId})
    },
    async getUsers(pageNumber: number, pageSize: number) {
        let skipCount = (pageNumber-1) * pageSize
        const totalCount = await usersCollection.countDocuments()
        const allUsers =  await usersCollection
            .find({})
            .skip(skipCount)
            .limit(pageSize)
            .toArray()
        return{
            "pagesCount": Math.ceil(totalCount/ pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": allUsers.map(u=>({id:u.id,login:u.login}) )
        }
    },
    async createUser (login:string, password:string) {
        const idUser = uuidv4()
        const test = jwt.sign({ id: idUser }, secret.key,{expiresIn:'1h'});
        const parse = jwt.verify(test,secret.key)
        const newUser = {
            id: idUser,
            login:login,
            password:password
        }
        await usersCollection.insertOne(newUser)
        // await tokensCollection.insertOne({token:{accessToken:password, refreshToken:password}})
        return {
            id: idUser,
            login:login
        }
    },
    async deleteUser (idUser:string){
        await usersCollection.deleteOne({id:idUser})
        return
    }
}

