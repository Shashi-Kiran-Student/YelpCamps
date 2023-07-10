const Joi = require('joi');

const campSchema = Joi.object({
    title: Joi.string()
        .required(),
    price: Joi.number()
        .required()
        .min(0),
    location: Joi.string(),
    description: Joi.string()
        .required(),
    deleteImages: Joi.array(),
    // images: Joi.array()
    //     .required(),
    geometry: Joi.object()
})

module.exports = campSchema;