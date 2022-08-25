import {commentsRepositories07} from "../repositories/comments-repositories07";

export const serviceComments04 = {
    async getComments(idComments:string){
       return await commentsRepositories07.getComments(idComments)
    },
    async getCommentsPost(idComments:string,pageNumber:number,pageSize:number){
      return  await commentsRepositories07.getCommentsPost(idComments,pageNumber,pageSize)
    },
    async createCommentsPost(idComments:string,content:string,token:string){
        return  await commentsRepositories07.createCommentsPost(idComments,content,token)
    },
    async updateComments(idComments:string,content:string){
       return await commentsRepositories07.updateComments(idComments,content)
    },
    async deleteComments(idComments:string){
       return await commentsRepositories07.deleteComments(idComments)
    },
}