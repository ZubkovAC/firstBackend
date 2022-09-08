import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from "mongoose";

const supertest = require('supertest');
import {
    app,
    startApp
} from "../../index";

const request = require('supertest')


// need get bloggers/bloggerId/posts
// need post bloggers/bloggerId/posts
describe('bloggers', () => {

    beforeAll(async () => {
        await startApp('test');
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe('get bloggers test', () => {
        it("get bloggers", async () => {
            await supertest(app)
                .get(`/ht_07/api/bloggers`)
                .expect(200, {
                    "pagesCount": 0,
                    "page": 1,
                    "pageSize": 10,
                    "totalCount": 0,
                    items: []
                })
        });
    })
    describe('get bloggersId test', () => {
        it("bloggersId should return a 404", async () => {
            const bloggerId = "f1990839-e1ea-464f-a611-01a8b201a168";
            await supertest(app)
                .get(`/ht_07/api/bloggers/${bloggerId}`)
                .expect(404)
        });
    })
    describe('test authorization bloggers ', () => {
        it("create blogger error authorization ", async () => {
            await supertest(app)
                .post(`/ht_07/api/bloggers`)
                .send({
                    "name": "string_string",
                    "youtubeUrl": "https://someurl.com"
                })
                .expect(401)
        });
    })
    describe('test create blogger ', () => {
        it("create blogger validation error name length 15", async () => {
            await supertest(app)
                .post(`/ht_07/api/bloggers`,).set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "name": "string_string_string",
                    "youtubeUrl": "https://someurl.com"
                })
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": 'must be at least 15 chars long',
                            "field": "name"
                        }
                    ]
                })
        });
        it("create blogger validation error no name body", async () => {
            await supertest(app)
                .post(`/ht_07/api/bloggers`,).set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "nam": "string_",
                    "youtubeUrl": "https://someurl.com"
                })
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": 'must be at least 15 chars long',
                            "field": "name"
                        }
                    ]
                })
        });
        it("create blogger validation error youtubeUrl ", async () => {
            await supertest(app)
                .post(`/ht_07/api/bloggers`,).set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "name": "Kavabanga",
                    "youtubeUrl": "123123123"
                })
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": 'Invalid value',
                            "field": "youtubeUrl"
                        }
                    ]
                })
        });
        it("create blogger validation error no youtubeUrl body", async () => {
            await supertest(app)
                .post(`/ht_07/api/bloggers`,).set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "name": "Kavabanga",
                    "youtubeUr": "123123123"
                })
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": 'Invalid value',
                            "field": "youtubeUrl"
                        }
                    ]
                })
        });
        it("create blogger validation error youtubeUrl length 100+ ", async () => {
            await supertest(app)
                .post(`/ht_07/api/bloggers`,).set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "name": "Kavabanga",
                    "youtubeUrl": "https://someurl1231231231312312313123123131231233131231231312312313123123313123123131231231312312313123123121231omeu.com"
                })
                .expect(400, {
                    "errorsMessages": [
                        {
                            "message": 'Invalid value',
                            "field": "youtubeUrl"
                        }
                    ]
                })
        });


        it("create blogger", async () => {
            const string = expect.any(String)
            const res = await request(app)
                .post(`/ht_07/api/bloggers`,).set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "name": "Kavabanga",
                    "youtubeUrl": "https://someurlomeu.com"
                })
                .expect(201)

            const bodyRes = res.body
            expect(bodyRes).toEqual({
                id: expect.any(String),
                "name": "Kavabanga",
                "youtubeUrl": "https://someurlomeu.com"
            })
        });
        // need preData and test preData for update/ get /  delete / get / getAll

        it("get bloggers", async () => {
            const string = expect.any(String)
            const res = await request(app)
                .get(`/ht_07/api/bloggers`)
                .expect(200)

            const bodyRes = res.body
            expect(bodyRes).toEqual({
                "pagesCount": expect.any(Number),
                "page": 1,
                "pageSize": 10,
                "totalCount": expect.any(Number),
                "items": [
                    {
                        "id": expect.any(String),
                        "name": expect.any(String),
                        "youtubeUrl": expect.any(String)
                    }
                ]
            })
            let blogger = bodyRes.items[0]
            const testBloggerData = await request(app)
                    .get(`/ht_07/api/bloggers/${blogger.id}`)
                    .expect(200)
            expect(blogger).toEqual(testBloggerData.body)
        });
        it("get bloggers - create - get - update - get", async () => {
            await request(app)
                .delete(`/ht_07/api/testing/all-data`)
                .expect(204)
            // get bloggers
            const res = await request(app)
                .get(`/ht_07/api/bloggers`)
                .expect(200)

            const bodyRes = res.body
            expect(bodyRes).toEqual({
                "pagesCount": expect.any(Number),
                "page": 1,
                "pageSize": 10,
                "totalCount": expect.any(Number),
                "items": []
            })
            // create blogger
            const res2 = await request(app)
                .post(`/ht_07/api/bloggers`,)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "name": "Kavabanga",
                    "youtubeUrl": "https://someurlomeu.com"
                })
                .expect(201)
            // get bloggerId
            const res3 = await request(app)
                .get(`/ht_07/api/bloggers`)
                .expect(200)

            const bloggerId = res3.body.items[0].id
            const res4 = await request(app)
                .get(`/ht_07/api/bloggers/${bloggerId}`)
                .expect(200)

            expect(res4.body).toEqual({
                    "id": bloggerId,
                    "name": "Kavabanga",
                    "youtubeUrl": "https://someurlomeu.com"
                }
            )
            // update blogerId
            const res5 = await request(app)
                .put(`/ht_07/api/bloggers/${bloggerId}`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({"name": "Kavabanga1",
                    "youtubeUrl": "https://someurlomeu1.com"})
                .expect(204)
            // get BloggerId - update
            const res6 = await request(app)
                .get(`/ht_07/api/bloggers/${bloggerId}`)
                .expect(200)

            expect(res6.body).toEqual({
                    "id": bloggerId,
                    "name": "Kavabanga1",
                    "youtubeUrl": "https://someurlomeu1.com"
                }
            )

        });
        it("create - get - delete - get BloggerId", async () => {
            await request(app)
                .delete(`/ht_07/api/testing/all-data`)
                .expect(204)

            const res1 = await request(app)
                .post(`/ht_07/api/bloggers`)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    "name": "Kavabanga",
                    "youtubeUrl": "https://someurlomeu.com"
                })
                .expect(201)
            const res2 = await request(app)
                .get(`/ht_07/api/bloggers`,)
                .expect(200)
            const bloggerId = res2.body.items[0].id
            const res3 = await request(app)
                .get(`/ht_07/api/bloggers/${bloggerId}`,)
                .expect(200)
            expect(res3.body).toEqual({
                id:bloggerId,
                "name": "Kavabanga",
                "youtubeUrl": "https://someurlomeu.com"
            })
            // no Authorization
            const res4 = await request(app)
                .delete(`/ht_07/api/bloggers/${bloggerId}`,)
                .expect(401)
            // delete
            const res5 = await request(app)
                .delete(`/ht_07/api/bloggers/${bloggerId}`,)
                .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
                .expect(204)
            // test 404
            const res6 = await request(app)
                .get(`/ht_07/api/bloggers/${bloggerId}`,)
                .expect(404)
        });

    })
    
});
