const { Router } = require('express');
const {
    login,
    create,
    logout,
    checkAuth
} = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');
const { User } = require('../database/models/user.model');

const authRouter = Router();

authRouter.post('/login', login)
authRouter.post('/signup', create)
authRouter.post('/logout', logout)
authRouter.get('/checkAuth', auth, checkAuth)

authRouter.post('/updateUserToken', async (req, res) => {
    const { notifyToken, userId } = req.body;
    try {
        await User.updateOne({
            _id: userId
        }, {
            $set: {
                notifyToken: notifyToken
            }
        })
        res.send({ message: 'User notification token registered' });
    }
    catch (error) {
        next(error)
    }
})


module.exports = {
    authRouter,
}