const mongoose = require('mongoose');

const User = mongoose.model(
    "user",
    mongoose.Schema(
        {
            email: String,
            password: String,
            role: { type: String, default: 'user' }
        },
        { versionKey: false }
    )
);


module.exports = {
    User
}