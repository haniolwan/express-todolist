const Joi = require('joi');

const idSchema = Joi.object({
    id: Joi.number().required(),
})

const userSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required()
})

module.exports = {
    userSchema,
    idSchema
}