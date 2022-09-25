const express = require('express');
const { authRouter } = require('./router/auth');

const app = express();

app.set('port', 3333)
app.use(authRouter)
app.use(express.static('public'))
app.use(express.static('views'))


module.exports = {
    app
}