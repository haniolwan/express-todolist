const { Router } = require('express');
const { getAllUsers, getAllTodos } = require('../controllers/admin.controller');

const adminRouter = Router();

adminRouter.post('/users', getAllUsers)
adminRouter.post('/todos', getAllTodos)

module.exports = {
    adminRouter
}