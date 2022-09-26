const { verify } = require('jsonwebtoken');
const { Todo } = require("../models/todo.model");
const { User } = require("../models/user.model");
const { tokenSchema, CustomError } = require("../utils");


const getAllUsers = async (req, res, next) => {
    try {
        const { token } = await tokenSchema.validateAsync(req.body);
        const { role } = await verify(token, process.env.SECRET_KEY);
        if (role === 'admin') {
            const users = await User.find({});
            res.json({ message: "Success", users })
        } else {
            throw new CustomError(400, 'Not Authorized')
        }
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const getAllTodos = async (req, res, next) => {
    try {
        const { token } = await tokenSchema.validateAsync(req.body.token);
        const { role } = await verify(token, process.env.SECRET_KEY);
        if (role === 'admin') {
            const todos = await Todo.find({});
            res.json({ message: "Success", todos })
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