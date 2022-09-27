const { Router } = require('express');
const { create,
    findAll,
    update,
    deleteItem,
    getTodo,
    filterByCategory,
} = require('../controllers/todo.controller');

const todoRouter = Router();


todoRouter.get('/', findAll)
todoRouter.post('/create', create)
todoRouter.route('/:id')
    .get(getTodo)
    .delete(deleteItem)
    .put(update);

todoRouter.get('/category/:category', filterByCategory)


module.exports = {
    todoRouter
}