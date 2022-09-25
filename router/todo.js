const { Router } = require('express');
const { create,
    findAll,
    update,
    deleteItem,
    findFirst,
    deleteRecords
} = require('../controllers/todo.controller');
const todoRouter = Router();

todoRouter.post('/create', create)
todoRouter.get('/all', findAll)
todoRouter.get('/delete-all', deleteRecords)

todoRouter.route('/:id')
    .get(findFirst)
    .delete(deleteItem)
    .put(update);




module.exports = {
    todoRouter
}