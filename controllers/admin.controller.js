const { verify } = require('jsonwebtoken');
const { Todo } = require("../database/models/todo.model");
const { User } = require("../database/models/user.model");
const { tokenSchema, CustomError } = require("../utils");


const getAllUsers = async (req, res, next) => {
    try {
        const { token } = await tokenSchema.validateAsync(req.body);
        const { email } = verify(token, process.env.SECRET_KEY);
        const { role } = await User.findOne({ email });
        if (role === 'admin') {
            const users = await User.find({});
            res.json({ message: "Success", data: users })
        } else {
            throw new CustomError(400, 'Not Authorized')
        }
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const getAllTodos = async (req, res, next) => {
    try {
        const { token } = await tokenSchema.validateAsync(req.body);
        const { email } = verify(token, process.env.SECRET_KEY);
        const { role } = await User.findOne({ email });
        if (role === 'admin') {
            const todos = await Todo.find({});
            res.json({ message: "Success", data: todos })
        } else {
            throw new CustomError(400, 'Not Authorized')
        }
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

module.exports = {
    getAllUsers,
    getAllTodos
}