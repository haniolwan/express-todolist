const Joi = require('joi');

const todoSchema = Joi.object({
    title: Joi.string().required(),
    priority: Joi.string(),
    time: Joi.string().required(),
    date: Joi.string().required(),
    motivation: Joi.string().allow(''),
    category: Joi.array(),
    color: Joi.string().required(),
    notification: Joi.boolean().allow(''),
})

module.exports = {
    todoSchema,
}