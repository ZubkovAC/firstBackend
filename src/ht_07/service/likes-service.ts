import {injectable} from "inversify";

@injectable()
export class LikesService {
    async baseLikesSchema(){
       return {
           extendedLikesInfo:{
               likesCount: 0,
               dislikesCount: 0,
               myStatus: "None",
               newestLikes: []
           }
       }
    }
}