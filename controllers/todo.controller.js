
const { verify } = require('jsonwebtoken');
const { Todo } = require('../models/todo.model');

const {
    todoSchema,
    idSchema,
    CustomError,
    tokenSchema
} = require('../utils');
const { categorySchema } = require('../utils/category.validation');
const { querySchema } = require('../utils/query.validation');

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
        res.json({ message: "Todo created successfully" });
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const getTodo = async (req, res, next) => {
    try {
        const { id: todoId } = await idSchema.validateAsync(req.params);
        const { token } = await tokenSchema.validateAsync(req.body);
        const { id: userId } = await verify(token, process.env.SECRET_KEY);
        const todo = await Todo.findOne({ _id: todoId })
        if (!todo) throw new CustomError(400, 'Todo doesnt exist');
        if (todo.user_id !== userId) throw new CustomError(400, 'Not Authroized');
        res.json({ message: "Success", data: todo });
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const { id: todoId } = await idSchema.validateAsync(req.params);
        const { token } = await tokenSchema.validateAsync(req.body);
        const { id: userId } = await verify(token, process.env.SECRET_KEY);
        const todo = await Todo.findOne({ _id: todoId, user_id: userId });
        if (!todo) throw new CustomError(400, 'Todo doesnt exist');
        if (todo.user_id !== userId) throw new CustomError(400, 'Not Authroized');
        await todo.deleteOne({});
        res.json({ message: "Todo deleted successfully" })
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const { title, body, color, category, token } = await todoSchema.validateAsync(req.body);
        const { id: todoId } = await idSchema.validateAsync(req.params);
        const { id: userId } = await verify(token, process.env.SECRET_KEY);
        const todo = await Todo.findOne({ _id: todoId });
        if (!todo) throw new CustomError(400, 'Todo doesnt exist');
        if (todo.user_id !== userId) throw new CustomError(400, 'Not Authorized');
        await todo.updateOne({
            title,
            body,
            color,
            category,
            user_id: userId
        })
        res.json({ message: "Todo updated successfully" })
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const findAll = async (req, res, next) => {
    try {
        const { token } = await tokenSchema.validateAsync(req.body);
        const { id: userId } = await verify(token, process.env.SECRET_KEY);
        const todos = await Todo.find({ user_id: userId })
        res.json({ message: "Success", data: todos });
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const filterByCategory = async (req, res, next) => {
    try {
        const { token } = await tokenSchema.validateAsync(req.body);
        const { category } = await categorySchema.validateAsync(req.params);
        const { id: userId } = await verify(token, process.env.SECRET_KEY);
        const todos = await Todo.find({ category, user_id: userId })
        res.json({ message: "Success", data: todos })
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const filterTodo = async (req, res, next) => {
    try {
        const { search } = await querySchema.validateAsync(req.query);
        const { token } = await tokenSchema.validateAsync(req.body);
        const { id: userId } = await verify(token, process.env.SECRET_KEY);
        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const todos = await Todo.find({
            $and: [{ user_id: userId }],
            $or: [
                { title: { $regex: rgx(search), $options: 'i' } },
                { body: { $regex: rgx(search), $options: 'i' } },
            ]
        }).limit(5)
        res.json({ message: "Success", data: todos })
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

module.exports = {
    create,
    getTodo,
    deleteItem,
    update,
    findAll,
    filterTodo,
    filterByCategory
}