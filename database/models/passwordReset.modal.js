const mongoose = require('mongoose');

const PasswordReset = mongoose.model(
    "resetpassword",
    mongoose.Schema(
        {
            user_id: String,
            user_token: String,
            createdAt: { type: Date, expires: 86400, default: Date.now },
            isResetted: { type: Boolean, default: false }
        },
        { versionKey: false }
    )
);


module.exports = {
    PasswordReset
}