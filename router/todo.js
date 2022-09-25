const { Router } = require('express');
const { create,
    findAll,
    edit,
    deleteItem,
    findFirst,
    deleteRecords
} = require('../controllers/todo.controller');
const todoRouter = Router();

todoRouter.post('/create', create)
todoRouter.get('/all', findAll)

todoRouter.route('/:id')
    .get(findFirst)
    .delete(deleteItem)
    .patch(edit);


todoRouter.get('/delete-all', deleteRecords)



module.exports = {
    todoRouter
}