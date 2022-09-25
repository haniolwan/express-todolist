const mongoose = require('mongoose');

const User = mongoose.model(
    "user",
    mongoose.Schema(
        {
            email: String,
            password: String
        },
        { versionKey: false }
    )
);


module.exports = {
    User
}