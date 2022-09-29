
const { Todo } = require('../database/models/todo.model');
const { querySchema } = require('../utils');


const create = async (req, res, next) => {
    try {
        const { title, body, color, category } = await todoSchema.validateAsync(req.body);
        const { id: userId } = req.user;
        const todo = new Todo({
            title,
            body,
            color,
            category,
            user_id: userId
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
        const { id: userId } = req.user;
        const todo = await Todo.findOne({ _id: todoId })
        if (!todo) {
            throw new CustomError(400, 'Todo doesnt exist');
        }
        if (todo.user_id !== userId) {
            throw new CustomError(403, 'Not Authroized');
        }
        res.json({ message: "Success", data: todo });
    } catch (error) {
        if (error.name === 'CastError') {
            next(new CustomError(400, 'Todo Doesnt exist'))
        } else if (error.name === 'ValidaitonError') {
            next(new CustomError(400, error.message))
        }
        next(error)
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const { id: todoId } = await idSchema.validateAsync(req.params);
        const { id: userId } = req.user;
        const todo = await Todo.findOne({ _id: todoId, user_id: userId });
        if (!todo) {
            throw new CustomError(400, 'Todo doesnt exist');
        }
        if (todo.user_id !== userId) {
            throw new CustomError(403, 'Not Authroized');
        }
        await todo.deleteOne({});
        res.json({ message: "Todo deleted successfully" })
    } catch (error) {
        if (error.name === 'CastError') {
            next(new CustomError(400, 'Todo Doesnt exist'))
        } else if (error.name === 'ValidaitonError') {
            next(new CustomError(400, error.message))
        }
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const { title, body, color, category } = await todoSchema.validateAsync(req.body);
        const { id: todoId } = await idSchema.validateAsync(req.params);
        const { id: userId } = req.user;
        const todo = await Todo.findOne({ _id: todoId });
        if (!todo) {
            throw new CustomError(400, 'Todo doesnt exist');
        }
        if (todo.user_id !== userId) {
            throw new CustomError(403, 'Not Authorized');
        }
        await todo.updateOne({
            title,
            body,
            color,
            category,
            user_id: userId
        })
        res.json({ message: "Todo updated successfully" })
    } catch (error) {
        if (error.name === 'CastError') {
            next(new CustomError(400, 'Todo Doesnt exist'))
        } else if (error.name === 'ValidationError') {
            next(new CustomError(400, error.message))
        }
        next(error)
    }
}

const findAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '' } = await querySchema.validateAsync(req.query);
        const { id: userId } = req.user;
        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const { docs, page: currentPage, totalPages } = await Todo.paginate(
            {
                $and: [{ user_id: userId }],
                $or: [
                    { title: { $regex: rgx(search), $options: 'i' } },
                    { body: { $regex: rgx(search), $options: 'i' } },
                ]
            },
            {
                page,
                limit
            },
        )
        res.json({
            message: "Success",
            data: docs,
            currentPage,
            totalPages
        });
    } catch (error) {
        error.name === 'ValidationError' ? next(new CustomError(400, error.message)) : next(error);
    }
}

const filterByCategory = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '' } = await querySchema.validateAsync(req.query);
        const { category } = await categorySchema.validateAsync(req.params);
        const { id: userId } = req.user;
        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const { docs, page: currentPage, totalPages } = await Todo.paginate({
            $and: [{ category, user_id: userId }],
            $or: [
                { title: { $regex: rgx(search), $options: 'i' } },
                { body: { $regex: rgx(search), $options: 'i' } },
            ]
        },
            {
                page,
                limit
            });
        res.json({
            message: "Success",
            data: docs,
            currentPage,
            totalPages
        });
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
    filterByCategory
}