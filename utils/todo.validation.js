const Joi = require('joi');

const todoSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    category: Joi.array().required(),
    color: Joi.string().required(),
    token: Joi.string().required(),
})

module.exports = {
    todoSchema,
}