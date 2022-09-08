import {injectable} from "inversify";
import {likesCollectionModel} from "../db";

@injectable()
export class LikesRepositories{
    async createLikesId(newLikesObject){
       await likesCollectionModel.insertMany([newLikesObject])
       return
    }
    async getLikes(){

    }
}