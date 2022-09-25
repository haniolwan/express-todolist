
var { verify } = require('jsonwebtoken');
const { Todo } = require('../models/todo.model');
const customError = require('../utils/custom.error');
const { todoSchema } = require('../utils/todo.validation');

const create = async (req, res, next) => {
    try {
        const { title, body, color, category, token } = await todoSchema.validateAsync(req.body);
        const { email } = await verify(token, process.env.SECRET_KEY);
        const todo = new Todo({
            title,
            body,
            color,
            category,
            user: email
        });
        await todo.save();
        res.json({ message: "To do created successfully" });
    } catch (error) {
        error.name === 'ValidationError' ? next(new customError(400, error.message)) : next(error);
    }
}

const deleteItem = () => {

}
const edit = () => {

}
const findAll = async (req, res, next) => {
    try {
        const { token } = await todoSchema.validateAsync(req.body);
        const { email } = await verify(token, process.env.SECRET_KEY);
        const todos = await Todo.find({ user: email })
        res.json({ message: "Success", data: todos });
    } catch (error) {
        error.name === 'ValidationError' ? next(new customError(400, error.message)) : next(error);
    }
}

module.exports = {
    create,
    deleteItem,
    edit,
    findAll
}