const { join } = require('path');
const { Router } = require('express');
const { login, create, findAll, findUser } = require('../controllers/user.controller');

const authRouter = Router();

authRouter.post('/login', login)

authRouter.post('/signup', create)

authRouter.get('/users', findAll)

authRouter.get('/users/:id', findUser)

module.exports = {
    authRouter
}