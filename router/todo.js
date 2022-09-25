const { Router } = require('express');
const { create, findAll } = require('../controllers/todo.controller');
const todoRouter = Router();

todoRouter.post('/create', create)

todoRouter.get('/all', findAll)


module.exports = {
    todoRouter
}