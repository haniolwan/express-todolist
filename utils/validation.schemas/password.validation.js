const Joi = require('joi');

const passwordSchema = Joi.object({
    password: Joi.string().required(),
    confirmPassword: Joi.string().required()
})

module.exports = {
    passwordSchema
}