const { Router } = require('express');
const { login, create } = require('../controllers/user.controller');

const authRouter = Router();

authRouter.post('/login', login)
authRouter.post('/signup', create)

module.exports = {
    authRouter
}