const mongoose = require('mongoose');

const User = mongoose.model(
    "user",
    mongoose.Schema(
        {
            name: String,
            email: String,
            password: String,
            image: { type: String, default: 'https://i.pinimg.com/736x/b0/e2/f5/b0e2f54d141a70986beac46962394651.jpg' },
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