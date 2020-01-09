const express = require('express');
const { createValidator } = require('express-joi-validation');

const { get, getAll, post, put, deleteCar } = require('./handlers');
const { schema, strictSchema } = require('./schemas/car');

const router = express.Router();
const validator = createValidator({
  passError: true
});

router
  .get('/', getAll)
  .get('/:id', get)
  .post('/', validator.body(strictSchema), post)
  .put('/:id', validator.body(schema), put)
  .delete('/:id', deleteCar);

module.exports = router;
