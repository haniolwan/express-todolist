
const { verify } = require('jsonwebtoken');

const {
    CustomError,
} = require('../utils');


const auth = async (req, res, next) => {
    try {
        const token = req.headers['token'] || req.cookies._token;
        const user = verify(token, process.env.SECRET_KEY);
        req.user = user;
        next();
    }
    catch (error) {
        next(new CustomError('Unauthorized user', 401));
    }
}

module.exports = {
    auth
}