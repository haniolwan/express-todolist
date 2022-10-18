
const { Todo } = require('../database/models/todo.model');
const {
    querySchema,
    todoSchema,
    CustomError,
    idSchema
} = require('../utils');

const create = async (req, res, next) => {
    try {
        const {
            title,
            priority,
            time,
            date,
            motivation,
            category,
            color
        } = await todoSchema.validateAsync(req.body);
        const { id: userId } = req.user;
        const todo = new Todo({
            title,
            priority,
            time,
            date,
            motivation,
            category,
            color,
            user_id: userId
        });
        await todo.save();
        res.json({ message: "Todo created successfully" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            next(new CustomError(400, error.message))
        }
        next(error);
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
        const {
            title,
            priority,
            time,
            date,
            motivation,
            category,
            color,
        } = await todoSchema.validateAsync(req.body);
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
            priority,
            time,
            date,
            motivation,
            category,
            color,
            user_id: userId
        })
        res.json({ message: "Todo updated successfully" })
    } catch (error) {
        if (error.name === 'CastError') {
            next(new CustomError(400, 'Todo doesnt exist'))
        } else if (error.name === 'ValidationError') {
            next(new CustomError(400, error.message))
        }
        next(error)
    }
}

const findAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '', priority = '', date = '' } = await querySchema.validateAsync(req.query);
        const { id: userId } = req.user;
        const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
        const { docs, page: currentPage, totalPages } = await Todo.paginate(
            {
                $and: [
                    { user_id: userId, },
                    { priority: { $regex: rgx(priority), $options: 'i' } },
                    { date: { $regex: rgx(date), $options: 'i' } },
                ],
                $or: [
                    { title: { $regex: rgx(search), $options: 'i' } },
                    { body: { $regex: rgx(search), $options: 'i' } },
                ],
            },
            {
                page,
                limit,
                sort: { state: 'desc', createdAt: 'asc' },
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
            })
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

const completeAll = async (req, res, next) => {
    try {
        await Todo.updateMany({ state: "open" }, { $set: { state: "done" } });
        res.json({ message: "Todos completed successfully" })
    } catch (error) {
        next(error)
    }
}

const completeTodo = async (req, res, next) => {
    try {
        const { id: todoId } = await idSchema.validateAsync(req.params);
        const { id: userId } = req.user;
        const todo = await Todo.findOne({ _id: todoId });
        if (!todo) {
            throw new CustomError(400, 'Todo doesnt exist');
        }
        if (todo.user_id !== userId) {
            throw new CustomError(403, 'Not Authorized');
        }
        if (todo.state === 'open') {
            await todo.updateOne({
                state: 'done',
                user_id: userId
            });
            res.json({ message: "Todo completed successfully" })
        } else {
            await todo.updateOne({
                state: 'open',
                user_id: userId
            })
            res.json({ message: "Todo opened successfully" })
        }
    } catch (error) {
        if (error.name === 'CastError') {
            next(new CustomError(400, 'Todo doesnt exist'))
        } else if (error.name === 'ValidationError') {
            next(new CustomError(400, error.message))
        }
        next(error)
    }
}

const statistics = async (req, res, next) => {
    try {
        const completedTasks = await Todo.find({ state: 'done' }).count();
        const remainingTasks = await Todo.find({ state: 'open' }).count();
        let total = completedTasks + remainingTasks;
        if (!total) {
            total = 1;
        }
        res.json({
            completedTasks,
            remainingTasks,
            completionRate: (completedTasks / total * 100).toFixed(1) + '%'
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    create,
    getTodo,
    deleteItem,
    update,
    findAll,
    filterByCategory,
    completeAll,
    completeTodo,
    statistics
}