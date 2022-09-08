import {app, startApp} from "../../index";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
const supertest = require('supertest');
const request = require('supertest')

describe('users', () => {
    beforeAll(async () => {
        await startApp('test');
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })
    describe('get users test', () => {
        // no test validation
        it('get users',async ()=>{
            await request(app)
                .get(`/ht_07/api/users`)
                .expect(200,{
                    "pagesCount": 0,
                    "page": 1,
                    "pageSize": 10,
                    "totalCount": 0,
                    "items": []
                })
        })
    })

    describe('users create test validation',()=>{
        it('users create - validation login 2 symbol error',async ()=>{
            const res =await request(app)
                .post('/ht_07/api/users')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    login:'as',
                    email:'test@mail.ru',
                    password:'1233321'
                })
                expect(res.status).toBe(400)
                expect(res.body).toEqual({
                    "errorsMessages": [
                        {
                            "message": expect.any(String),
                            "field": "login"
                        }
                    ]
                })
        })
        it('users create - validation login 10+ symbol error',async ()=>{
            const res =await request(app)
                .post('/ht_07/api/users')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    login:'userTest1123',
                    email:'test@mail.ru',
                    password:'1233321'
                })
                expect(res.status).toBe(400)
                expect(res.body).toEqual({
                    "errorsMessages": [
                        {
                            "message": expect.any(String),
                            "field": "login"
                        }
                    ]
                })
        })
        it('users create - validation password 5 symbol error',async ()=>{
            const res =await request(app)
                .post('/ht_07/api/users')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    login:'userTest',
                    email:'test@mail.ru',
                    password:'12333'
                })
                expect(res.status).toBe(400)
                expect(res.body).toEqual({
                    "errorsMessages": [
                        {
                            "message": expect.any(String),
                            "field": "password"
                        }
                    ]
                })
        })
        it('users create - validation password 20+ symbol error',async ()=>{
            const res =await request(app)
                .post('/ht_07/api/users')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    login:'userTest',
                    email:'test@mail.ru',
                    password:'123331233312333123331'
                })
                expect(res.status).toBe(400)
                expect(res.body).toEqual({
                    "errorsMessages": [
                        {
                            "message": expect.any(String),
                            "field": "password"
                        }
                    ]
                })
        })
        it('users create - validation email symbol error',async ()=>{
            const res =await request(app)
                .post('/ht_07/api/users')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    login:'userTest',
                    email:'testMail',
                    password:'123455678'
                })
                expect(res.status).toBe(400)
                expect(res.body).toEqual({
                    "errorsMessages": [
                        {
                            "message": expect.any(String),
                            "field": "email"
                        }
                    ]
                })
        })
        it('users create - validation email2 symbol error',async ()=>{
            const res =await request(app)
                .post('/ht_07/api/users')
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    login:'userTest',
                    email:'testMail.ru',
                    password:'123455678'
                })
                expect(res.status).toBe(400)
                expect(res.body).toEqual({
                    "errorsMessages": [
                        {
                            "message": expect.any(String),
                            "field": "email"
                        }
                    ]
                })
        })
    })

    describe('delete users test', () => {
        it('delete users no authrozation',async ()=>{
            await request(app)
                .delete(`/ht_07/api/users/${123}`)
                .expect(401)
        })
        it('delete users 404',async ()=>{
            await request(app)
                .delete(`/ht_07/api/users/${123}`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .expect(404)
        })
        it('delete users create - delete - get',async ()=>{
            // create User
            const newUser =await request(app)
                .post(`/ht_07/api/users/`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "login": "testUser",
                    "email": "test@mail.ru",
                    "password": "testTest"
                })
                .expect(201)
            expect(newUser.body).toEqual({
                id:newUser.body.id,
                login:"testUser"
            })
            // get Users
            const users = await request(app)
                .get(`/ht_07/api/users/`)
                .expect(200)
            const user = await users.body.items[0]
            expect(user).toEqual({
                id:user.id,
                login:user.login
            })
            // delete Users
            await request(app)
                .delete(`/ht_07/api/users/${user.id}`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .expect(204)
            // users = 0
            const usersCount = await request(app)
                .get(`/ht_07/api/users/`)
                .expect(200)
            const userLength = usersCount.body.items.length
            expect(userLength).toBe(0)
        })
    })

})