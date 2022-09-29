const Joi = require('joi');

const categorySchema = Joi.object({
    category: Joi.string().required()
})

module.exports = {
    categorySchema
}