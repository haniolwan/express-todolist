const { Router } = require('express');
const {
    login,
    create,
    logout,
    checkAuth
} = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');

const authRouter = Router();

authRouter.post('/login', login)
authRouter.post('/signup', create)
authRouter.post('/logout', logout)
authRouter.get('/checkAuth', auth, checkAuth)


module.exports = {
    authRouter
}