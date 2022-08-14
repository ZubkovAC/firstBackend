import {secret, usersCollection06, usersCollectionTest} from "../db";
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
            "items": allUsers.map(u=>({id:u.id,login:u.login}) )
        }
    },
    async createUser (login:string, password:string ,email:string) {
        const idUser = uuidv4()
        const test = jwt.sign({ id: idUser }, secret.key,{expiresIn:'1h'});
        const parse = jwt.verify(test,secret.key)
        const newUser = {
            id: idUser,
            login:login,
            password:password,
            email:email
        }
        await usersCollection06.insertMany([newUser])

        // for TEST
        const userId = uuidv4()
        const token =  jwt.sign({userId, login,email,password},
            process.env.SECRET_KEY,
            // {expiresIn: dateExpired["10sec"]}),
            {expiresIn: dateExpired["1h"]})
        const refreshPassword = jwt.sign({ userId,login,email,password},
            process.env.SECRET_KEY,
            // {expiresIn: dateExpired["20sec"]},
            {expiresIn: dateExpired["2h"]}
        )
        const conformationCode = uuidv4()
        const user :RegistrationTokenType = await manager.createUser(userId,refreshPassword,login,email,token,conformationCode)
        return {
            id: idUser,
            login:login
        }
    },
    async deleteUser (idUser:string){
        await usersCollection06.deleteOne({id:idUser})
        return
    }
}

