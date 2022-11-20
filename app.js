const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser");
const { authRouter } = require('./router/auth')
const { todoRouter } = require('./router/todo')
const { adminRouter } = require('./router/admin');
const { User } = require('./database/models/user.model');
require('dotenv').config()


let DB_URL = '';
if (process.env.MONGODB_URI) {
    DB_URL = process.env.MONGODB_URI
} else if (process.env.NODE_ENV === 'dev') {
    DB_URL = process.env.DATABASE_URL
} else if (process.env.NODE_ENV === 'test') {
    DB_URL = process.env.DATABASE_TEST_URL
} else {
    throw new Error('NODE_ENV is not set');
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
app.use(cors());
app.use(cookieParser());
app.use('/api', authRouter)
app.use('/api/todo', todoRouter)
app.use('/api/admin', adminRouter)
app.get('/deleteAll', async (req, res) => {
    await User.deleteMany({});
    res.json({ message: "All todos has been deleted" })
})

app.get(require('./middleware/taskQueue'))

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message || 'Server Error' })
})

module.exports = {
    app, db,
}