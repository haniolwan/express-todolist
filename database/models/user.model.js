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
        },
        { versionKey: false }
    )
);


module.exports = {
    User
}