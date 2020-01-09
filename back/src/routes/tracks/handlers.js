const asyncRoute = require('route-async');
const { ObjectID } = require('mongodb');
const { keyBy, flatten } = require('lodash');

const getDb = require('../../db');

const validateCarIds = async (ids = []) => {
  if (ids.length > 0) {
    const db = await getDb();
    const carIds = ids.map(id => new ObjectID(id));

    const count = await db
      .collection('cars')
      .find({
        _id: { $in: carIds }
      })
      .count();

    return count === ids.length;
  }

  return true;
};

const getCars = async ids => {
  const db = await getDb();

  if (ids.length === 0) {
    return [];
  }

  const cars = await db
    .collection('cars')
    .find({
      _id: { $in: ids.map(id => new ObjectID(id)) }
    })
    .toArray();

  return cars;
};

module.exports.get = asyncRoute(async (req, res) => {
  const db = await getDb();
  const track = await db.collection('tracks').findOne({
    _id: new ObjectID(req.params.id)
  });

  if (track) {
    const cars = await getCars(track.cars);

    return res.json({
      ...track,
      cars
    });
  }

  return res.sendStatus(404);
});

// TODO Pagination?
module.exports.getAll = asyncRoute(async (req, res) => {
  const db = await getDb();
  const { search } = req.query;

  const filter = search
    ? {
        $text: { $search: search }
      }
    : {};

  const tracks = await db
    .collection('tracks')
    .find(filter)
    .toArray();

  const allIds = flatten(tracks.map(track => track.cars || []));

  const cars = await getCars(allIds);
  const carsMap = keyBy(cars, '_id');

  res.json(
    tracks.map(track => ({
      ...track,
      cars: track.cars && track.cars.map(car => carsMap[car])
    }))
  );
});

module.exports.post = asyncRoute(async (req, res) => {
  const { body } = req;

  const db = await getDb();

  const idsValid = await validateCarIds(body.cars);

  if (!idsValid) {
    return res.sendStatus(400);
  }

  await db.collection('tracks').insert({
    ...body,
    cars: body.cars.map(id => new ObjectID(id))
  });

  res.json(body);
});

module.exports.put = asyncRoute(async (req, res) => {
  const { body } = req;

  const db = await getDb();

  const idsValid = await validateCarIds(body.cars);

  if (!idsValid) {
    return res.sendStatus(400);
  }

  const {
    result: { nModified }
  } = await db.collection('tracks').replaceOne(
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

module.exports.deleteTrack = asyncRoute(async (req, res) => {
  const db = await getDb();
  const { deletedCount } = await db.collection('tracks').deleteOne({
    _id: new ObjectID(req.params.id)
  });

  if (!deletedCount) {
    return res.sendStatus(404);
  }

  return res.sendStatus(200);
});

module.exports.deleteCarFromTrack = asyncRoute(async (req, res) => {
  const db = await getDb();

  const trackId = new ObjectID(req.params.trackId);
  const carId = new ObjectID(req.params.carId);

  const { modifiedCount } = await db.collection('tracks').updateOne(
    {
      _id: trackId
    },
    {
      $pull: { cars: carId }
    }
  );

  if (!modifiedCount) {
    return res.sendStatus(404);
  }

  return res.sendStatus(200);
});
