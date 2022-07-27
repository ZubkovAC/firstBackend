import {commentsRepositories04} from "../repositories/comments-repositories04";

export const serviceComments04 = {
    async getComments(idComments:string){
       await commentsRepositories04.getComments(idComments)
    },
    async getCommentsPost(idComments:string,pageNumber:number,pageSize:number){
       await commentsRepositories04.getCommentsPost(idComments,pageNumber,pageSize)
    },
    async createCommentsPost(idComments:string,content:string,token:string){
       await commentsRepositories04.createCommentsPost(idComments,content,token)
    },
    async updateComments(content:string,idComments:string){
       await commentsRepositories04.updateComments(content,idComments)
    },
    async deleteComments(idComments:string){
       await commentsRepositories04.deleteComments(idComments)
    },
}