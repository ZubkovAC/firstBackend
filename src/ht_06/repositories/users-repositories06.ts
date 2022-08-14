import {registrationToken06, secret, usersCollection06, usersCollectionTest} from "../db";
// import jwt from 'jsonwebtoken'
var jwt = require('jsonwebtoken')
import { v4 as uuidv4 } from 'uuid'
import {RegistrationTokenType} from "../types";
import {manager} from "../managerAuth/managerAuth";
import {dateExpired} from "../routers/auth06";



export const usersRepositories06 ={
    async findUserId(userId:string){
        return await usersCollection06.findOne({id:userId})
    },
    async getUsers(pageNumber: number, pageSize: number) {
        let skipCount = (pageNumber-1) * pageSize
        const totalCount = await usersCollection06.countDocuments()
        const allUsers =  await usersCollection06
            .find({})
            .skip(skipCount)
            .limit(pageSize)
            .lean()
        return{
            "pagesCount": Math.ceil(totalCount/ pageSize),
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": allUsers.map(u=>({id:u.accountData.userId,login:u.accountData.login}) )
        }
    },
    async createUser (login:string,email:string,passwordHash:string,salt:string,jwtPas:string) {
        const userId = uuidv4()
        const conformationCode = uuidv4()
        const user :RegistrationTokenType = await manager.createUser(login,email,passwordHash,salt,jwtPas,userId,conformationCode)
        console.log("user",user)
        await registrationToken06.insertMany([user])
        await usersCollection06.insertMany([user])
        return {
            id: userId,
            login:login
        }
    },
    async deleteUser (idUser:string){
        await usersCollection06.deleteOne({id:idUser})
        return
    }
}

