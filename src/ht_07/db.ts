import mongoose from "mongoose";

const BloggersSchema = new mongoose.Schema({
    id:String,
    name:String,
    youtubeUrl:String
});
const PostsSchema = new mongoose.Schema({
    id:String,
    title: String,
    shortDescription: String,
    content: String,
    bloggerId: String,
    bloggerName: String,
    addedAt:String,
});

const CommentsSchema = new mongoose.Schema({
    idPostComment: String,
    id: String,
    content: String,
    userId: String,
    userLogin: String,
    addedAt: String
});
const LikesSchema = new mongoose.Schema({
        id:String,
        newestLikes: [
            {
                addedAt: Date,
                userId: String,
                login: String,
                myStatus: String
                // myStatus: "None" || "Like" || "Dislike",
            }
        ]
});
const CountRequestSchema = new mongoose.Schema({
    id: String,
    date: Date
});
const RegistrationSchema = new mongoose.Schema({
    accountData:{
        userId:String,
        login:String,
        email:String,
        createAt:Date,
        passwordAccess:String,
        passwordRefresh:String,
        hash:String,
        salt:String
    },
    emailConformation:{
        conformationCode:String,
        expirationDate:Date,
        isConfirmed:Boolean
    }
});
const BlackListTokenSchema = new mongoose.Schema({
    userId:String,
    token:String
});


export const likesCollectionModel = mongoose.model('likes', LikesSchema);

export const bloggersCollectionModel = mongoose.model('bloggers', BloggersSchema);
export const postsCollectionModel = mongoose.model('posts', PostsSchema);
export const commentsCollectionModel = mongoose.model('comments', CommentsSchema);
export const backListTokenModel = mongoose.model('blackListToken',BlackListTokenSchema)
export const userRegistrationModel = mongoose.model('registrationToken', RegistrationSchema);
// 429 auth
export const countRequestLoginModel = mongoose.model('countRequestLogin', CountRequestSchema);
export const countRequestRegistrationModel = mongoose.model('countRequestRegistration', CountRequestSchema);
export const countRequestEmailResendingModel = mongoose.model('countRequestEmailResending', CountRequestSchema);
export const countRequestRegistrationConformationModel = mongoose.model('countRequestRegistrationConformation', CountRequestSchema);


export const secret = {
    key : process.env.SECRET_KEY
}
const mongoUri = process.env.MONGO_DB || 'mongodb://0.0.0.0:27017'

export async function runDb(){
    try{
        await mongoose.connect(mongoUri)
        console.log('соедениние установлено')
    }catch {
        console.log('Ошибка соединения')
        await mongoose.disconnect()
    }
}



