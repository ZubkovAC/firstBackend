import {usersRepositories06} from "../repositories/users-repositories06";

export const serviceUser04 ={
    async findUserId(userId:string){
        return  await usersRepositories06.findUserId(userId)
    },
    async getUsers(pageNumber:number, pageSize:number){
       return  await usersRepositories06.getUsers(pageNumber,pageSize)
    },
    async createUsers(login:string, password:string){
       return  await usersRepositories06.createUser(login,password)
    },
    async deleteUsers(userId:string){
       return  await usersRepositories06.deleteUser(userId)
    }
}