import {usersRepositories06} from "../repositories/users-repositories06";

export const serviceUser04 ={
    async findUserId(userId:string){
        return  await usersRepositories06.findUserId(userId)
    },
    async getUsers(pageNumber:number, pageSize:number){
       return  await usersRepositories06.getUsers(pageNumber,pageSize)
    },
    async createUsers(login:string, email:string,passwordHash:string,salt:string,jwtPas:string){
       return  await usersRepositories06.createUser(login,email,passwordHash,salt,jwtPas)
    },
    async deleteUsers(userId:string){
       return  await usersRepositories06.deleteUser(userId)
    }
}