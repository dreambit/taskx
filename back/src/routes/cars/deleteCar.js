const asyncRoute = require('route-async');
const { ObjectID } = require('mongodb');
const { ValidationError } = require('@hapi/joi/lib/errors');
const getDb = require('../../db');

module.exports = asyncRoute(async (req, res) => {
  const db = await getDb();
  const carId = new ObjectID(req.params.id);

  // check if car is used by some track
  const tracksCount = await db
    .collection('tracks')
    .find({ cars: carId })
    .limit(1)
    .count();

  // make business validations in middleware? hmm
  if (tracksCount) {
    throw new ValidationError('Car is used by track');
  }

  const { deletedCount } = await db.collection('cars').deleteOne({
    _id: carId
  });

  // track does not exit
  if (!deletedCount) {
    return res.sendStatus(404);
  }

  return res.sendStatus(200);
});
