const { Router } = require('express');
const { getAllUsers, getAllTodos } = require('../controllers/admin.controller');

const adminRouter = Router();

adminRouter.get('/users', getAllUsers)
adminRouter.get('/todos', getAllTodos)

module.exports = {
    adminRouter
}