import {UsersRepositories} from "../repositories/users-repositories07";
import {inject, injectable} from "inversify";

@injectable()
export class UserService {
    constructor(@inject(UsersRepositories) protected usersRepositories:UsersRepositories ) {
    }
    async findUserId(userId:string){
        return  await this.usersRepositories.findUserId(userId)
    }
    async getUsers(pageNumber:number, pageSize:number){
       return  await this.usersRepositories.getUsers(pageNumber,pageSize)
    }
    async createUsers(userId:string,login:string, email:string,passwordAccess:string,passwordRefresh:string,hash:string,salt:string ,isConfirmed?:boolean){
       return  await this.usersRepositories.createUser(userId,login,email,passwordAccess,passwordRefresh,hash,salt,isConfirmed)
    }
    async deleteUsers(userId:string){
       return  await this.usersRepositories.deleteUser(userId)
    }
}