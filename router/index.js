const { adminRouter } = require("./admin");
const { authRouter } = require("./auth");
const { todoRouter } = require("./todo");

module.exports = {
    adminRouter,
    authRouter,
    todoRouter
}