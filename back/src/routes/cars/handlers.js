const asyncRoute = require('route-async');
const { ObjectID } = require('mongodb');

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
  const { body } = req;

  const db = await getDb();
  await db.collection('cars').insertOne(body);

  res.json(body);
});

module.exports.put = asyncRoute(async (req, res) => {
  const { body } = req;

  const db = await getDb();

  const {
    result: { nModified }
  } = await db.collection('cars').replaceOne(
    {
      _id: new ObjectID(req.params.id)
    },
    body
  );

  if (!nModified) {
    return res.sendStatus(404);
  }

  return res.json(body);
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
    return res.sendStatus(400);
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
