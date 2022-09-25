
var { verify } = require('jsonwebtoken');
const { Todo } = require('../models/todo.model');
const { User } = require('../models/user.model');


const { todoSchema,
    idSchema,
    CustomError
} = require('../utils');

const create = async (req, res, next) => {
    try {
        const { title, body, color, category, token } = await todoSchema.validateAsync(req.body);
        const { id } = await verify(token, process.env.SECRET_KEY);
        const todo = new Todo({
            title,
            body,
            color,
            category,
            user_id: id
        });
        await todo.save();
        res.json({ message: "To do created successfully" });
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const findFirst = async (req, res, next) => {
    try {
        const { id: _id } = await idSchema.validateAsync(req.params);
        const { token } = req.body;
        const { id: userId } = await verify(token, process.env.SECRET_KEY);
        const todo = await Todo.findOne({ _id })
        if (userId === todo.user_id) {
            res.json({ message: "Success", data: todo });
        } else {
            throw new CustomError(400, 'Not Authroized')
        }
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const { id: todoId } = await idSchema.validateAsync(req.params);
        const { token } = req.body;
        const { id: userId } = await verify(token, process.env.SECRET_KEY);
        const todo = await Todo.findById(todoId);
        if (userId === todo.user_id) {
            await todo.deleteOne({});
            res.json({ message: "Todo deleted successfully" })
        } else {
            throw new CustomError(400, 'Not Authroized')
        }
    } catch (error) {
        next(error)
    }

}
const edit = async (req, res, next) => {

}

const findAll = async (req, res, next) => {
    try {
        const { token } = req.body;
        const { id } = await verify(token, process.env.SECRET_KEY);
        const todos = await Todo.find({ user_id: id })
        res.json({ message: "Success", data: todos });
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const deleteRecords = async (req, res, next) => {
    await User.deleteMany({})

    await Todo.deleteMany({})
}

module.exports = {
    create,
    findFirst,
    deleteItem,
    edit,
    findAll,
    deleteRecords
}