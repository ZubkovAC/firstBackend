export type BloggersType = {
    id:string
    name:string
    youtubeUrl:string
}
export type PostsType = {
    "id": string
    "title": string
    "shortDescription": string
    "content": string
    "bloggerId": string
    "bloggerName": string
    addedAt:string
}
export type UsersType = {
    "id": string
    login:string
    password:string
}
export type CommentsType = {
    idPostComment :string
    "id": string
    "content": string
    "userId": string
    "userLogin": string
    "addedAt": string
}
export type CountRequestType = {
    ip:string
    date:Date
}
export type RegistrationTokenType = {
    accountData:{
        userId:string
        login:string
        email:string
        createAt:Date
        passwordAccess:string
        passwordRefresh:string,
        hash:string
        salt:string
    }
    emailConformation:{
        conformationCode:string
        expirationDate:Date
        isConfirmed:boolean
    }
}

export type dateUserJwtType ={
    userId:string
    login:string
    email:string
}

export class BloggerMongoDBType {
    constructor(public id:string,public name:string, public youtubeUrl:string) {
    }
}