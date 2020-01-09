const asyncRoute = require('route-async');
const { ObjectID } = require('mongodb');
const { ValidationError } = require('@hapi/joi/lib/errors');

const getDb = require('../../db');

module.exports.get = asyncRoute(async (req, res) => {
  const db = await getDb();
  const car = await db.collection('cars').findOne({
    _id: new ObjectID(req.params.id)
  });

  if (car) {
    return res.json(car);
  }

  return res.sendStatus(404);
});

module.exports.getAll = asyncRoute(async (req, res) => {
  const db = await getDb();
  const cars = await db
    .collection('cars')
    .find()
    .toArray();

  res.json(cars);
});

module.exports.post = asyncRoute(async (req, res) => {
  const { body: car } = req;

  const db = await getDb();
  await db.collection('cars').insertOne(car);

  res.json(car);
});

module.exports.put = asyncRoute(async (req, res) => {
  const { body: car } = req;

  const db = await getDb();

  const { value: updatedCar } = await db.collection('cars').findOneAndUpdate(
    {
      _id: new ObjectID(req.params.id)
    },
    {
      $set: {
        ...car
      }
    },
    {
      returnOriginal: false
    }
  );

  if (!updatedCar) {
    return res.sendStatus(404);
  }

  return res.json(updatedCar);
});

module.exports.deleteCar = asyncRoute(async (req, res) => {
  const db = await getDb();
  const carId = new ObjectID(req.params.id);

  // check if car is used by some track
  const tracksCount = await db
    .collection('tracks')
    .find({ cars: carId })
    .limit(1)
    .count();

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
