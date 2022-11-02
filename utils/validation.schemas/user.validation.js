const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required()
})

const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
})

const idSchema = Joi.object({
    id: Joi.string().required(),
})

module.exports = {
    registerSchema,
    loginSchema,
    idSchema
}