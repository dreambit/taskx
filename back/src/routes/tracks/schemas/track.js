const Joi = require('@hapi/joi');

module.exports = Joi.object({
  name: Joi.string()
    .min(4)
    .max(20)
    .required(),

  description: Joi.string()
    .min(10)
    .max(60)
    .required(),

  length: Joi.object({
    unit: Joi.string()
      .valid('km')
      .required(),
    value: Joi.number().required()
  }).required(),

  cars: Joi.array().items(
    Joi.string()
      .length(24)
      .required()
  )
});
