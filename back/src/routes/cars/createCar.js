const asyncRoute = require('route-async');
const getDb = require('../../db');

module.exports = asyncRoute(async (req, res) => {
  const { body: car } = req;

  const db = await getDb();
  await db.collection('cars').insertOne(car);

  res.json(car);
});
