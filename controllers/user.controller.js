
const Joi = require('joi');
const { compare } = require('bcryptjs');
var { sign } = require('jsonwebtoken');
const { User } = require('./../models/user.model');
const customError = require('../utils/custom.error');



const login = async (req, res) => {
    try {
        const schema = Joi.object({
            password: Joi.string().required(),
            email: Joi.string().required()
        })
        const { email, password } = await schema.validateAsync(req.body);
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
    catch ({ message }) {
        res.json({
            message
        })
    }
}
const create = (req, res) => {
    const { email, password } = req.body;
    const user = new User(
        {
            email, password
        }
    );
    user.save(user).then((result) => {
        res.send({ message: "user added successfully" })
    }).catch((error) => {
        res.status(500).send({
            message: "Some error occured"
        });
    })
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