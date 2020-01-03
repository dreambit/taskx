const { MongoClient } = require('mongodb');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const url = `mongodb://${username}:${password}@mongo:27017/smartcars`;
let dbCache;

module.exports = () => {
  if (dbCache) {
    return Promise.resolve(dbCache);
  }

  return MongoClient.connect(url)
    .then(client => client.db())
    .then(db => {
      dbCache = db;
      return db;
    });
};
