import 'reflect-metadata'
import {userRegistrationModel} from "../db";
import { v4 as uuidv4 } from 'uuid'
import {RegistrationTokenType} from "../types";
import {manager} from "../managerAuth/managerAuth";
import {injectable} from "inversify";


@injectable()
export class UsersRepositories {
    async findUserId(userId:string){
        return userRegistrationModel.findOne({id:userId})
    }
    async getUsers(pageNumber: number, pageSize: number) {
        let skipCount = (pageNumber-1) * pageSize
        const totalCount = await userRegistrationModel.countDocuments()
        const allUsers =  await userRegistrationModel
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
    }
    async createUser (userId:string,login:string, email:string,passwordAccess:string,passwordRefresh:string,hash:string,salt:string, isConfirmed?:boolean) {
        const conformationCode = uuidv4()
        const user :RegistrationTokenType = await manager.createUser(login,email,passwordAccess,passwordRefresh,hash,salt,userId,conformationCode,isConfirmed)
        await userRegistrationModel.insertMany([user])
        return {
            id: userId,
            login:login
        }
    }
    async deleteUser (idUser:string){
        await userRegistrationModel.deleteOne({id:idUser})
        return
    }
}

