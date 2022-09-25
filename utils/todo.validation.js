const Joi = require('joi');

const todoSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string(),
    category: Joi.array(),
    color: Joi.string(),
    token: Joi.string().required(),
})

module.exports = {
    todoSchema,
}