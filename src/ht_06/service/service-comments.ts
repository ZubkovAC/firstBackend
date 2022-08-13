import {commentsRepositories06} from "../repositories/comments-repositories06";

export const serviceComments04 = {
    async getComments(idComments:string){
       return await commentsRepositories06.getComments(idComments)
    },
    async getCommentsPost(idComments:string,pageNumber:number,pageSize:number){
      return  await commentsRepositories06.getCommentsPost(idComments,pageNumber,pageSize)
    },
    async createCommentsPost(idComments:string,content:string,token:string){
        return  await commentsRepositories06.createCommentsPost(idComments,content,token)
    },
    async updateComments(idComments:string,content:string){
       return await commentsRepositories06.updateComments(idComments,content)
    },
    async deleteComments(idComments:string){
       return await commentsRepositories06.deleteComments(idComments)
    },
}