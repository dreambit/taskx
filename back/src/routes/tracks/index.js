const express = require('express');
const { createValidator } = require('express-joi-validation');

const { get, getAll, post, put, deleteTrack, deleteCarFromTrack } = require('./handlers');
const { schema, strictSchema } = require('./schemas/track');

const router = express.Router();
const validator = createValidator({
  passError: true
});

router
  .get('/', getAll)
  .get('/:id', get)
  .post('/', validator.body(strictSchema), post)
  .put('/:id', validator.body(schema), put)
  .delete('/:id', deleteTrack)
  .delete('/:trackId/cars/:carId', deleteCarFromTrack);

module.exports = router;
