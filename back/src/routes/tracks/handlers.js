const asyncRoute = require('route-async');
const { ObjectID } = require('mongodb');
const { keyBy, flatten } = require('lodash');
const { ValidationError } = require('@hapi/joi/lib/errors');

const getDb = require('../../db');

/**
 * Check car ids for existence
 *
 * @param ids car ids
 * @throws ValidationError if some car does not exist
 */
const validateCarIds = async (ids = []) => {
  if (!ids.length) {
    return;
  }

  const db = await getDb();

  const count = await db
    .collection('cars')
    .find({
      _id: { $in: ids }
    })
    .count();

  if (count !== ids.length) {
    throw new ValidationError('Specified car(s) does not exist');
  }
};

/**
 * Get car documents by ids
 */

// pass db connection as argument? hmm, sounds good but connection is cached, makes no sense
const getCars = async (carIds = []) => {
  if (carIds.length === 0) {
    return [];
  }

  const db = await getDb();

  return db
    .collection('cars')
    .find({
      _id: { $in: carIds }
    })
    .toArray();
};

module.exports.get = asyncRoute(async (req, res) => {
  const db = await getDb();
  const track = await db.collection('tracks').findOne({
    _id: new ObjectID(req.params.id)
  });

  // enrich track with car objects
  // aka code level JOIN (use denormalization? depends on the task..., read intensive or update intensive etc.)
  if (track) {
    const cars = await getCars(track.cars.map(car => new ObjectID(car)));

    return res.json({
      ...track,
      cars
    });
  }

  return res.sendStatus(404);
});

// TODO Pagination? infinite scroll?
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

  // enrich track with car objects
  // get all cars for all tracks in the single request
  const allIds = flatten(tracks.map(track => track.cars));

  const cars = await getCars(allIds.map(car => new ObjectID(car)));

  // build map [car id] -> car
  const carsMap = keyBy(cars, '_id');

  res.json(
    tracks.map(track => ({
      ...track,
      cars: track.cars.map(car => carsMap[car])
    }))
  );
});

module.exports.post = asyncRoute(async (req, res) => {
  const {
    body: {
      cars = [], // default to empty array to db
      ...track
    }
  } = req;

  const db = await getDb();
  const carIds = cars.map(id => new ObjectID(id));

  await validateCarIds(carIds);

  const { insertedId } = await db.collection('tracks').insertOne({
    ...track,
    cars: carIds
  });

  res.json({
    ...track,
    _id: insertedId,
    cars: await getCars(carIds)
  });
});

module.exports.put = asyncRoute(async (req, res) => {
  const { cars = [], ...track } = req;

  const carIds = cars.map(carId => new ObjectID(carId));

  await validateCarIds(carIds);

  const db = await getDb();

  const { modifiedCount } = await db.collection('tracks').updateOne(
    {
      _id: new ObjectID(req.params.id)
    },
    {
      $set: {
        ...track,
        cars: carIds
      }
    }
  );

  if (!modifiedCount) {
    return res.sendStatus(404);
  }

  return res.json({
    ...track,
    cars
  });
});

module.exports.deleteTrack = asyncRoute(async (req, res) => {
  const db = await getDb();
  const { deletedCount } = await db.collection('tracks').deleteOne({
    _id: new ObjectID(req.params.id)
  });

  // nothing to delete?
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
