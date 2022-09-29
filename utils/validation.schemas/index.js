const { categorySchema } = require("./category.validation");
const { querySchema } = require("./query.validation");
const { todoSchema } = require("./todo.validation");
const { tokenSchema } = require("./token.validation");
const { userSchema, idSchema } = require("./user.validation");

module.exports = {
    categorySchema,
    querySchema,
    todoSchema,
    tokenSchema,
    userSchema,
    idSchema
}