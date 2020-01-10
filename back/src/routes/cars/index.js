const express = require('express');
const { createValidator } = require('express-joi-validation');

const { schema, strictSchema } = require('./schemas/car');

const getAllCars = require('./getAllCars');
const getCar = require('./getCar');
const createCar = require('./createCar');
const updateCar = require('./updateCar');
const deleteCar = require('./deleteCar');

const router = express.Router();
const validator = createValidator({
  passError: true
});

router
  .get('/', getAllCars)
  .get('/:id', getCar)
  .post('/', validator.body(strictSchema), createCar)
  .put('/:id', validator.body(schema), updateCar)
  .delete('/:id', deleteCar);

module.exports = router;
