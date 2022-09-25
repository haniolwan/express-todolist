const { join } = require('path');
const { Router } = require('express');


const authRouter = Router();

authRouter.get('/login', (req, res) => {
    res.sendFile(join(__dirname, '..', 'views', 'login.html'));
})
authRouter.post('/login', (req, res) => {
    res.send("Post login")
})

authRouter.get('/signup', (req, res) => {
    res.sendFile(join(__dirname, '..', 'views', 'signup.html'));
})
authRouter.post('/signup', (req, res) => {
    res.send("Post Signup")
})

module.exports = {
    authRouter
}