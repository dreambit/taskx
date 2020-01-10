const asyncRoute = require('route-async');
const getDb = require('../../db');

module.exports = asyncRoute(async (req, res) => {
  const db = await getDb();
  const cars = await db
    .collection('cars')
    .find()
    .toArray();

  res.json(cars);
});
