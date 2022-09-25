const Joi = require('joi');

const tokenSchema = Joi.object({
    token: Joi.string().required()
})

module.exports = {
    tokenSchema
}