const express = require('express');
const { createValidator } = require('express-joi-validation');

const { get, getAll, post, put, deleteCar } = require('./handlers');
const carSchema = require('./schemas/car');

const router = express.Router();
const validator = createValidator();

router
  .get('/', getAll)
  .get('/:id', get)
  .post('/', validator.body(carSchema), post)
  .put('/:id', validator.body(carSchema), put)
  .delete('/:id', deleteCar);

module.exports = router;
