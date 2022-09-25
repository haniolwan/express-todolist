
const { compare, hash, genSalt } = require('bcryptjs');
var { sign } = require('jsonwebtoken');
const { User } = require('./../models/user.model');
const customError = require('../utils/custom.error');
const { userSchema } = require('../utils/user.validation');



const login = async (req, res) => {
    try {
        const { email, password } = await userSchema.validateAsync(req.body);
        const user = await User.find({ email });
        if (!user) {
            throw new customError(400, "User doesnt exist")
        }
        const isValid = await compare(password, user[0].password);
        if (!isValid) {
            throw new customError(400, "Password doesnt match")
        } else {
            const token = await sign({ email, password }, 'shhhhhh');
            res.cookie('ACCESS_TOKEN', token).json({ message: "Welcome user" });
        }
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
        const token = await sign({ email, password }, 'shhhhhh');
        res.cookie('ACCESS_TOKEN', token).json({ message: "Welcome user" });
    } catch (error) {
        next(error)
    }

}

const findAll = async (req, res) => {
    return User.find()
        .then(data => {
            res.send({ message: "Success", data });
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occured"
            });
        });
}

const findUser = async (req, res) => {
    return User.find()
        .then(data => {
            res.send({ message: "Success", data });
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occured"
            });
        });
}


module.exports = {
    create, findAll, login, findUser
}