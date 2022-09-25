const { Router } = require('express');

const authRouter = Router();

authRouter.get('/login', (req, res) => {
    res.send("Hello From Login")
})

module.exports = {
    authRouter
}