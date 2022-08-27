import {CommentsRepositories} from "../repositories/comments-repositories07";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsRepositories) protected commentsRepositories:CommentsRepositories) {
    }
    async getComments(idComments:string){
       return await this.commentsRepositories.getComments(idComments)
    }
    async getCommentsPost(idComments:string,pageNumber:number,pageSize:number){
      return  await this.commentsRepositories.getCommentsPost(idComments,pageNumber,pageSize)
    }
    async createCommentsPost(idComments:string,content:string,token:string){
        return  await this.commentsRepositories.createCommentsPost(idComments,content,token)
    }
    async updateComments(idComments:string,content:string){
       return await this.commentsRepositories.updateComments(idComments,content)
    }
    async deleteComments(idComments:string){
       return await this.commentsRepositories.deleteComments(idComments)
    }
}