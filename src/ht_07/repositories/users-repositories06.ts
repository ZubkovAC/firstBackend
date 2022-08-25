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
    async createUser (userId:string,login:string, email:string,passwordAccess:string,passwordRefresh:string,hash:string,salt:string, isConfirmed?:boolean) {
        const conformationCode = uuidv4()
        const user :RegistrationTokenType = await manager.createUser(login,email,passwordAccess,passwordRefresh,hash,salt,userId,conformationCode,isConfirmed)
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

