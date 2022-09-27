const express = require('express')
const { authRouter } = require('./router/auth')
require('dotenv').config()
const mongoose = require('mongoose')
const { todoRouter } = require('./router/todo')
const { adminRouter } = require('./router/admin')

let DB_URL = '';
if (process.env.NODE_ENV === 'dev') {
    DB_URL = process.env.DATABASE_URL
} else if (process.env.NODE_ENV === 'test') {
    DB_URL = process.env.DATABASE_TEST_URL
}

mongoose.connect(DB_URL)
const db = mongoose.connection
db.on('error', () => {
    console.log('Database Connection Error')
})
db.on('open', () => {
    console.log('Database Connected')
})



const app = express();

app.set('port', 8888)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', authRouter)
app.use('/api/todo', todoRouter)
app.use('/api/admin', adminRouter)



app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || 'Server Error' })
})

module.exports = {
    app, db
}