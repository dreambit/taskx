const asyncRoute = require('route-async');
const { ObjectID } = require('mongodb');
const getDb = require('../../db');

module.exports = asyncRoute(async (req, res) => {
  const db = await getDb();
  const car = await db.collection('cars').findOne({
    _id: new ObjectID(req.params.id)
  });

  if (car) {
    return res.json(car);
  }

  return res.sendStatus(404);
});
