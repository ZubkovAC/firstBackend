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
    bloggerName: String
});
const UsersSchema = new mongoose.Schema({
    id:String,
    login:String,
    password:String
});
const CommentsSchema = new mongoose.Schema({
    idPostComment :String,
    id: String,
    content: String,
    userId: String,
    userLogin: String,
    addedAt: String
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
        salt:String // for test BCRUPT
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
export const bloggersCollection06 = mongoose.model('bloggers', BloggersSchema);
export const postsCollection06 = mongoose.model('posts', PostsSchema);
// export const usersCollection06 = mongoose.model('users', UsersSchema);
export const usersCollection06 = mongoose.model('users', RegistrationSchema);
export const commentsCollection06 = mongoose.model('comments', CommentsSchema);
export const registrationToken06 = mongoose.model('registrationToken', RegistrationSchema);
export const backListToken = mongoose.model('blackListToken',BlackListTokenSchema)
// 429 auth
export const countRequestLogin06 = mongoose.model('countRequestLogin', CountRequestSchema);
export const countRequestRegistration06 = mongoose.model('countRequestRegistration', CountRequestSchema);
export const countRequestEmailResending06 = mongoose.model('countRequestEmailResending', CountRequestSchema);
export const countRequestRegistrationConformation06 = mongoose.model('countRequestRegistrationConformation', CountRequestSchema);

export const usersCollectionTest = mongoose.model('usersTest', UsersSchema);
export const registrationTokenTest = mongoose.model('registrationTokenTest', RegistrationSchema);

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



