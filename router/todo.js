const { Router } = require('express');
const { create,
    findAll,
    update,
    deleteItem,
    getTodo,
    filterByCategory,
    completeAll,
    completeTodo,
    statistics,
    setAlert
} = require('../controllers/todo.controller');
const { auth } = require('../middleware/auth');

const todoRouter = Router();


todoRouter.use(auth)

todoRouter.get('/', findAll)
todoRouter.post('/create', create)
todoRouter.route('/:id')
    .post(completeTodo)
    .get(getTodo)
    .delete(deleteItem)
    .put(update);

todoRouter.get('/category/:category', filterByCategory)
todoRouter.post('/', completeAll)

todoRouter.get('/statistics/all', statistics)

todoRouter.post('/:id/setAlert', setAlert)

module.exports = {
    todoRouter
}