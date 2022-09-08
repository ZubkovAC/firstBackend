import {app, startApp} from "../../index";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
const supertest = require('supertest');
const request = require('supertest')

describe('posts', () => {
    beforeAll(async () => {
        await startApp('test');
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    })
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })
    describe('posts get', () => {
        beforeAll(async () => {
            // create user
            const newUser = await request(app)
                .post(`/ht_07/api/users/`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "login": "testUser",
                    "email": "test@mail.ru",
                    "password": "testTest"
                })
                .expect(201)
        })
        it('get posts',async()=>{
            // no test query params ( pageNumber/pageSize )
            const posts = await request(app)
                .get(`/ht_07/api/posts/`)
                .expect(200)
            expect(posts.body).toEqual({
                "pagesCount": 0,
                "page": 1,
                "pageSize": 10,
                "totalCount": 0,
                "items": []
            })
        })
        it('postsId test 404', async ()=>{
            const posts = await request(app)
                .get(`/ht_07/api/posts/12312213asdf`)
                .expect(404)
        })
        it('test get postId', async ()=>{
            // test user data
            const password = 'test_test'
            const email = 'testEmail@mail.ru'
            const login = 'testLogin'

            // posts test data
            const title= "testTitle"
            const shortDescription= "shortDescriptionTest"
            const content= "contentTest"

            // blogger
              const bloggerName = "Kavabanga"
              const youtubeUrl = "https://someurlomeu.com"
            // create user

            const testLogin = await request(app)
                .post(`/ht_07/api/users/`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    login:login,
                    email:email,
                    password:password
                })
                .expect(201)
            const user = await testLogin.body
            expect(user).toEqual({
                id:user.id,
                login:login
            })
            // create blogger
            const blogger = await request(app)
                .post(`/ht_07/api/bloggers`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "name": bloggerName,
                    "youtubeUrl": youtubeUrl
                })
                .expect(201)
            expect(blogger.body).toEqual({
                id:blogger.body.id,
                "name": bloggerName,
                "youtubeUrl": youtubeUrl
            })
            // create post
            await request(app)
                .post(`/ht_07/api/posts`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "title": "testTitle",
                    "shortDescription": "shortDescriptionTest",
                    "content": "contentTest",
                    "bloggerId": blogger.body.id
                })
                .expect(201)
            // get post Id
            const postId = await request(app)
                .get(`/ht_07/api/posts/`)
                .expect(200)
            // get postId
            const testDataPost = await request(app)
                .get(`/ht_07/api/posts/${postId.body.items[0].id}`)
                .expect(200)
                expect(testDataPost.body).toEqual({
                    "id": postId.body.items[0].id,
                    "title": title,
                    "shortDescription": shortDescription,
                    "content": content,
                    "bloggerId": blogger.body.id,
                    "bloggerName": bloggerName,
                    "addedAt": expect.any(String),
                    "extendedLikesInfo": {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None",
                        "newestLikes": []
                    }
                })

            //update Posts/{id}
            const updatePost = await request(app)
                .put(`/ht_07/api/posts/${postId.body.items[0].id}`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "title": "title2",
                    "shortDescription": "shortDescription2",
                    "content": "content2",
                    "bloggerId": blogger.body.id
                })
                .expect(204)
            // correct updatePostId
            const upPost = await request(app)
                .get(`/ht_07/api/posts/${postId.body.items[0].id}`)
                .expect(200)
            expect(upPost.body).toEqual(
                {
                    "id": postId.body.items[0].id,
                    "title": "title2",
                    "shortDescription": "shortDescription2",
                    "content": "content2",
                    "bloggerId": blogger.body.id,
                    "bloggerName": bloggerName,
                    "addedAt": expect.any(String),
                    "extendedLikesInfo": {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None",
                        "newestLikes": []
                    }
                })
            // delete 401
            await request(app)
                .delete(`/ht_07/api/posts/${postId.body.items[0].id}`)
                .expect(401)
            // delete 404
            await request(app)
                .delete(`/ht_07/api/posts/asdfasdf213123asdfasdf`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .expect(404)

           // delete post Id
            await request(app)
                .delete(`/ht_07/api/posts/${postId.body.items[0].id}`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .expect(204)
            // get postsId - 404
            await request(app)
                .delete(`/ht_07/api/posts/${postId.body.items[0].id}`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .expect(404)



            // login
            // const token = await request(app)
            //     .post(`/ht_07/api/auth/login`)
            //     .send({
            //         login,password
            //     })
            //     .expect(200)
            // console.log(token.body.accessToken)
        })
    })
})