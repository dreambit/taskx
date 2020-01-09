const Joi = require('@hapi/joi');

const code = Joi.string()
  .min(4)
  .max(6);

const transmission = Joi.string().valid('manual', 'automatic');
const ai = Joi.boolean();

const maxSpeed = Joi.object({
  unit: Joi.string()
    .valid('mps')
    .required(),
  value: Joi.number().required()
});

module.exports.schema = Joi.object({
  code,
  transmission,
  ai,
  maxSpeed
});

module.exports.strictSchema = Joi.object({
  code: code.required(),
  transmission: transmission.required(),
  ai: ai.required(),
  maxSpeed: maxSpeed.required()
});
