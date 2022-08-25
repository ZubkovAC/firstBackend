import {usersRepositories06} from "../repositories/users-repositories06";

export const serviceUser04 ={
    async findUserId(userId:string){
        return  await usersRepositories06.findUserId(userId)
    },
    async getUsers(pageNumber:number, pageSize:number){
       return  await usersRepositories06.getUsers(pageNumber,pageSize)
    },
    async createUsers(userId:string,login:string, email:string,passwordAccess:string,passwordRefresh:string,hash:string,salt:string ,isConfirmed?:boolean){
       return  await usersRepositories06.createUser(userId,login,email,passwordAccess,passwordRefresh,hash,salt,isConfirmed)
    },
    async deleteUsers(userId:string){
       return  await usersRepositories06.deleteUser(userId)
    }
}