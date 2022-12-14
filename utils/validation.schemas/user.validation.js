const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    image: Joi.string().allow(''),
    loginType: Joi.string().required(),
})

const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    loginType: Joi.string().required(),
})

const idSchema = Joi.object({
    id: Joi.string().required(),
})

const emailSchema = Joi.object({
    email: Joi.string().required(),
})

module.exports = {
    registerSchema,
    loginSchema,
    idSchema,
    emailSchema
}