const asyncRoute = require('route-async');
const { ObjectID } = require('mongodb');

const getDb = require('../../db');

module.exports = asyncRoute(async (req, res) => {
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
