const express = require('express')
const { authRouter } = require('./router/auth')
require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', () => {
    console.log('Database Connection Error')
})
db.on('open', () => {
    console.log('Database Connected')
})

const userModel = require('./models/user.model')(mongoose)

const app = express();

app.set('port', 8888)
app.use(authRouter)
app.use(express.static('public'))
app.use(express.static('views'))


module.exports = {
    app
}