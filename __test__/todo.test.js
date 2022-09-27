const { default: mongoose } = require('mongoose');
const request = require('supertest');
const { app } = require('../app');
const { buildFakeData } = require('../database/build');

beforeEach(() => buildFakeData());

describe("Todo Operations", () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMzBiNDA1MDA5ZjZjYmEzODZjNjZiNSIsImVtYWlsIjoiaGFuaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1IiwiaWF0IjoxNjY0MjYzMTIyfQ.LVbyTzxXy8ym7tofvGkDmofX6UFbwZvDuESNmzrQflo"
    test("POST TODO CASE: todo created successfully", async () => {
        const payload = {
            title: "eat breakfast",
            body: "test body",
            color: "red",
            category: ['eating', 'playing'],
            token
        };
        const response = await request(app)
            .post('/api/todo/create')
            .send(payload)
            .expect(200)
            .expect('Content-type', /json/)
        expect(response.body).toMatchObject({ message: "Todo created successfully" })
    });

    test('GET TODO CASE: Success', async () => {
        const response = await request(app)
            .get('/api/todo/63317c6daede5ee4c18b6cd2')
            .send({ token })
            .expect(200)
            .expect('Content-type', /json/)
        expect(response.body).toMatchObject(
            {
                message: "Success",
                data: expect.objectContaining({
                    _id: expect.any(String),
                    title: expect.any(String),
                    body: expect.any(String),
                    color: expect.any(String),
                    category: expect.any(Array),
                    user_id: expect.any(String),
                }),
            }
        )
    })

    test('DELETE TODO CASE: Todo deleted successfully', async () => {
        const response = await request(app)
            .delete('/api/todo/63317c6daede5ee4c18b6cd2')
            .send({ token })
            .expect(200)
            .expect('Content-type', /json/)
        expect(response.body).toMatchObject({ message: "Todo deleted successfully" })
    })

    test('PUT TODO CASE: Todo updated successfully', async () => {
        const payload = {
            title: "New title",
            token
        }
        const response = await request(app)
            .put('/api/todo/63317c6daede5ee4c18b6cd2')
            .send(payload)
            .expect(200)
            .expect('Content-type', /json/)
        expect(response.body).toMatchObject({ message: "Todo updated successfully" })
    })

    test('GET TODO CASE: Todo doesnt exist', async () => {
        const response = await request(app)
            .get('/api/todo/sometodo')
            .send({ token })
            .expect(400)
            .expect('Content-type', /json/)
        expect(response.body).toMatchObject(
            {
                message: "Todo Doesnt exist",
            }
        )
    })

    test('GET TODO CASE: Not authorized', async () => {
        const response = await request(app)
            .get('/api/todo/63317c6daede5ee4c18b6cd2')
            .send({ token: token + "somedata" })
            .expect(403)
            .expect('Content-type', /json/)
        expect(response.body).toMatchObject(
            {
                message: "Not Authorized",
            }
        )
    })

    test('PUT TODO CASE: Title is required', async () => {
        const payload = {
            body: "New body todo",
            token
        }
        const response = await request(app)
            .put('/api/todo/63317c6daede5ee4c18b6cd2')
            .send(payload)
            .expect(400)
            .expect('Content-type', /json/)
        expect(response.body).toMatchObject({ message: "\"title\" is required" })
    })

})

afterAll(() => mongoose.connection.close());
