const Joi = require('joi');

const todoSchema = Joi.object({
    title: Joi.string().required(),
    priority: Joi.string().required(),
    time: Joi.string().required(),
    date: Joi.string().required(),
    motivation: Joi.string(),
    category: Joi.array(),
    color: Joi.string().required(),
})

module.exports = {
    todoSchema,
}