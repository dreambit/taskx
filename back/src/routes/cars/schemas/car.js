const Joi = require('@hapi/joi');

module.exports = Joi.object({
  code: Joi.string()
    .min(4)
    .max(6)
    .required(),

  transmission: Joi.string()
    .valid('manual', 'automatic')
    .required(),

  ai: Joi.boolean().required(),

  maxSpeed: Joi.object({
    unit: Joi.string()
      .valid('mps')
      .required(),
    value: Joi.number().required()
  }).required()
});
