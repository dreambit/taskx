const express = require('express');
const { createValidator } = require('express-joi-validation');

const { get, getAll, post, put, deleteTrack, deleteCarFromTrack } = require('./handlers');
const trackSchema = require('./schemas/track');

const router = express.Router();
const validator = createValidator();

router
  .get('/', getAll)
  .get('/:id', get)
  .post('/', validator.body(trackSchema), post)
  .put('/:id', validator.body(trackSchema), put)
  .delete('/:id', deleteTrack)
  .delete('/:trackId/cars/:carId', deleteCarFromTrack);

module.exports = router;
