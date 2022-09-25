
const { compare, hash, genSalt } = require('bcryptjs');
var { sign } = require('jsonwebtoken');
const { User } = require('./../models/user.model');
const customError = require('../utils/custom.error');
const { userSchema } = require('../utils/user.validation');



const login = async (req, res, next) => {
    try {
        const { email, password } = await userSchema.validateAsync(req.body);
        const user = await User.find({ email });
        if (!user) {
            throw new customError(400, "User doesnt exist")
        }
        const isValid = await compare(password, user[0].password);
        if (!isValid) {
            throw new customError(400, "Password doesnt match")
        }
        const token = await sign({ id: user[0]._id, email, password }, process.env.SECRET_KEY);
        res.json({ message: "Welcome user", token });
    }
    catch (error) {
        next(error)
    }
}
const create = async (req, res, next) => {
    try {
        const { email, password } = await userSchema.validateAsync(req.body);
        let isValid = await User.findOne({ email });
        if (isValid) {
            throw new customError(400, "User already exists")
        }
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        const user = new User({
            email,
            password: hashedPassword
        });
        await user.save();
        const token = await sign({ id: user[0]._id, email, password }, process.env.SECRET_KEY);
        res.json({ message: "Welcome user", token });
    } catch (error) {
        next(error)
    }

}

const findAll = async (req, res, next) => {
    try {
        const users = await User.find()
        res.json({ message: "Success", data: users });
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    create,
    findAll,
    login
}