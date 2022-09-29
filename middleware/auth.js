
const { verify } = require('jsonwebtoken');
const { User } = require('../database');

const {
    CustomError,
} = require('../utils');


const auth = async (req, res, next) => {
    try {
        const token = req.headers['token'];
        if (token) {
            const { email } = verify(token, process.env.SECRET_KEY);
            const user = await User.findOne({ email });
            if (!user) {
                throw new CustomError(400, 'No user with provided creditials');
            }
            req.user = user;
            next();
        } else {
            throw new CustomError(400, 'No provided token');
        }
    }
    catch (error) {
        next(error)
    }
}


module.exports = {
    auth
}