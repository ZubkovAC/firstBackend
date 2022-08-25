import {usersRepositories07} from "../repositories/users-repositories07";

export const serviceUser04 ={
    async findUserId(userId:string){
        return  await usersRepositories07.findUserId(userId)
    },
    async getUsers(pageNumber:number, pageSize:number){
       return  await usersRepositories07.getUsers(pageNumber,pageSize)
    },
    async createUsers(userId:string,login:string, email:string,passwordAccess:string,passwordRefresh:string,hash:string,salt:string ,isConfirmed?:boolean){
       return  await usersRepositories07.createUser(userId,login,email,passwordAccess,passwordRefresh,hash,salt,isConfirmed)
    },
    async deleteUsers(userId:string){
       return  await usersRepositories07.deleteUser(userId)
    }
}