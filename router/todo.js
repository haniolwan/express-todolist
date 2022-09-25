const { Router } = require('express');
const { create,
    findAll,
    update,
    deleteItem,
    getTodo,
} = require('../controllers/todo.controller');
const todoRouter = Router();

todoRouter.post('/create', create)
todoRouter.get('/all', findAll)

todoRouter.route('/:id')
    .get(getTodo)
    .delete(deleteItem)
    .put(update);

module.exports = {
    todoRouter
}