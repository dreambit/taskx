const Joi = require('@hapi/joi');

const name = Joi.string()
  .min(4)
  .max(20);

const description = Joi.string()
  .min(10)
  .max(60);

const length = Joi.object({
  unit: Joi.string()
    .valid('km')
    .required(),
  value: Joi.number().required()
});

const cars = Joi.array().items(
  Joi.string()
    .length(24)
    .required()
);

module.exports.schema = Joi.object({
  name,
  description,
  length,
  cars
});

module.exports.strictSchema = Joi.object({
  name: name.required(),
  description: description.required(),
  length: length.required(),
  cars
});
