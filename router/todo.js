const { Router } = require('express');
const { create,
    findAll,
    update,
    deleteItem,
    getTodo,
    filterByCategory,
    filterTodo
} = require('../controllers/todo.controller');

const todoRouter = Router();

todoRouter.get('/all', findAll)

todoRouter.post('/create', create)
todoRouter.route('/:id')
    .get(getTodo)
    .delete(deleteItem)
    .put(update);

todoRouter.get('/', filterTodo)
todoRouter.get('/category/:category', filterByCategory)

module.exports = {
    todoRouter
}