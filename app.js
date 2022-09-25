const express = require('express');
const { authRouter } = require('./router/auth');

const app = express();

app.set('port', 3333)
app.use('/api',authRouter)
app.use(express.static('public'))

module.exports = {
    app
}