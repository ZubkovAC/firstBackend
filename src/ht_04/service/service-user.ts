import {usersRepositories04} from "../repositories/users-repositories04";

export const serviceUser04 ={
    async findUserId(userId:string){
        return  await usersRepositories04.findUserId(userId)
    },
    async getUsers(pageNumber:number, pageSize:number){
       return  await usersRepositories04.getUsers(pageNumber,pageSize)
    },
    async createUsers(login:string, password:string){
       return  await usersRepositories04.createUser(login,password)
    },
    async deleteUsers(userId:string){
       return  await usersRepositories04.deleteUser(userId)
    }
}