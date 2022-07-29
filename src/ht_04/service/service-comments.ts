import {commentsRepositories04} from "../repositories/comments-repositories04";

export const serviceComments04 = {
    async getComments(idComments:string){
       return await commentsRepositories04.getComments(idComments)
    },
    async getCommentsPost(idComments:string,pageNumber:number,pageSize:number){
      return  await commentsRepositories04.getCommentsPost(idComments,pageNumber,pageSize)
    },
    async createCommentsPost(idComments:string,content:string,token:string){
        return  await commentsRepositories04.createCommentsPost(idComments,content,token)
    },
    async updateComments(idComments:string,content:string){
       return await commentsRepositories04.updateComments(idComments,content)
    },
    async deleteComments(idComments:string){
       return await commentsRepositories04.deleteComments(idComments)
    },
}