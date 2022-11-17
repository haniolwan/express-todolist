const mongoose = require('mongoose');

const User = mongoose.model(
    "user",
    mongoose.Schema(
        {
            name: String,
            email: String,
            password: String,
            role: { type: String, default: 'user' },
            notifyToken: String,
            locale: { type: String, default: 'en' },
            loginType: { type: String, default: 'user' }
        },
        { versionKey: false }
    )
);


module.exports = {
    User
}