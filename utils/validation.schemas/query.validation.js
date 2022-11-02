const Joi = require('joi');

const querySchema = Joi.object({
    page: Joi.string().trim(),
    limit: Joi.string().trim(),
    priority: Joi.string().trim().allow(''),
    search: Joi.string().trim().allow(''),
    date: Joi.string().trim(),
})

module.exports = {
    querySchema
}