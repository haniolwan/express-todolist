const request = require('supertest');
const { app } = require('../app');

describe("User Auth", () => {
    const email = (Math.random() + 1).toString(36).substring(7);
    test('Success Register', async () => {
        const payload = {
            email: `${email}@test.com`,
            password: "12345"
        }
        const response = await request(app)
            .post('/api/signup')
            .send(payload)
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toMatchObject({
            message: "Welcome user",
            token: expect.any(String),
        })
    });

    test('Success login', async () => {
        const payload = {
            email: `${email}@test.com`,
            password: '12345',
        };
        const response = await request(app)
            .post('/api/login')
            .send(payload)
            .expect(200)
            .expect('Content-Type', /json/);
        expect(response.body).toMatchObject({
            message: "Welcome user",
            token: expect.any(String),
        })
    });

    test('User doesnt exist', async () => {
        const payload = {
            email: 'noUser@test.com',
            password: '12345',
        };
        const response = await request(app)
            .post('/api/login')
            .send(payload)
            .expect(400);
        expect(response.body.message).toBe('User doesnt exist');
    });

    test('Password doesnt match', async () => {
        const payload = {
            email: 'hani@gmail.com',
            password: '00000',
        };
        const response = await request(app)
            .post('/api/login')
            .send(payload)
            .expect(400);
        expect(response.body.message).toBe('Password doesnt match');
    });

    test('User already exists', async () => {
        const payload = {
            email: 'hani@gmail.com',
            password: '12345',
        };
        const response = await request(app)
            .post('/api/signup')
            .send(payload)
            .expect(400);
        expect(response.body).toMatchObject({
            message: "User already exists",
        })
    });

    test('Email is required', async () => {
        const payload = {
            password: '12345',
        };
        const response = await request(app)
            .post('/api/signup')
            .send(payload)
            .expect(400);
        expect(response.body).toMatchObject({
            "message": "\"email\" is required"
        })
    });

})