const { Router } = require('express');
const {
    login,
    create,
    logout,
    checkAuth,
    updateUserToken,
    changePassowrd
} = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');

const authRouter = Router();

authRouter.post('/login', login)
authRouter.post('/signup', create)
authRouter.post('/logout', logout)

authRouter.post('/updateUserToken', updateUserToken)

authRouter.get('/checkAuth', auth, checkAuth)

authRouter.post('/changePassword', auth, changePassowrd)


module.exports = {
    authRouter,
}