const Joi = require('joi');

const querySchema = Joi.object({
    page: Joi.string().trim(),
    limit: Joi.string().trim(),
    search: Joi.string().trim(),
})

module.exports = {
    querySchema
}