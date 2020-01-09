const getDb = require('./index');

module.exports = async function init() {
  const db = await getDb();

  // TODO: for high-load use ElasticSearch instead of mongo text index
  await db.collection('tracks').createIndex({ name: 'text', description: 'text' });
};
