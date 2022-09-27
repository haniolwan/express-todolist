
const {
    compare,
    hash,
    genSalt
} = require('bcryptjs');
var { sign } = require('jsonwebtoken');
const { User } = require('./../models/user.model');
const { userSchema, CustomError } = require('../utils');


const login = async (req, res, next) => {
    try {
        const { email, password } = await userSchema.validateAsync(req.body);
        const user = await User.findOne({ email });
        if (!user) throw new CustomError(400, "User doesnt exist")
        const isValid = await compare(password, user.password);
        if (!isValid) throw new CustomError(400, "Password doesnt match");
        const token = sign({ id: user._id, email, password }, process.env.SECRET_KEY);
        res.json({ message: "Welcome user", token });
    }
    catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const { email, password } = await userSchema.validateAsync(req.body);
        let isValid = await User.findOne({ email });
        if (isValid) throw new CustomError(400, "User already exists")
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        const user = new User({
            email,
            password: hashedPassword
        });
        await user.save();
        const token = sign({ id: user._id, email, password }, process.env.SECRET_KEY);
        res.json({ message: "Welcome user", token });
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }

}

module.exports = {
    create,
    login
}