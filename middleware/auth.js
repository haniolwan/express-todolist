
const { verify } = require('jsonwebtoken');

const {
    CustomError,
} = require('../utils');

const auth = async (req, res, next) => {
    try {
        const user = verify(req.body.token, process.env.SECRET_KEY);
        req.user = user;
        next();
    }
    catch (error) {
        next(new CustomError(403, 'Not Authorized'));
    }
}


module.exports = {
    auth
}