const Joi = require('joi');

const reviewSchema = Joi.object({
    body: Joi.string()
        .required(),
    rating: Joi.number()
        .required()
        .min(0)
        .max(5),
})

module.exports = reviewSchema;