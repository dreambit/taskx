const { MongoClient } = require('mongodb');

const url = `mongodb://localhost:27018/smartcars`;
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
