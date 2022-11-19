const { Router } = require('express');
const {
    login,
    create,
    logout,
    checkAuth,
    updateUserToken,
    changePassowrd,
    setLocale,
    resetPassword
} = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');

const authRouter = Router();

authRouter.post('/signin', login)
authRouter.post('/signup', create)
authRouter.post('/logout', logout)

authRouter.post('/updateUserToken', updateUserToken)
authRouter.get('/checkAuth', auth, checkAuth)
authRouter.post('/changePassword', auth, changePassowrd)
authRouter.post('/setLanguage', auth, setLocale)

authRouter.post('/password/reset', resetPassword);


module.exports = {
    authRouter,
}