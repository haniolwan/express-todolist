const Joi = require('joi');

const userSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required()
})

const idSchema = Joi.object({
    id: Joi.string().required(),
})

module.exports = {
    userSchema,
    idSchema
}