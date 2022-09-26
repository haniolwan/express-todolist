const Joi = require('joi');

const querySchema = Joi.object({
    search: Joi.string().required().trim().min(1)
})

module.exports = {
    querySchema
}