const express = require('express');
const cors = require('cors');

const cars = require('./routes/cars');
const tasks = require('./routes/tracks');
const initDB = require('./db/init');

// should be done in DB layer, Atlas etc.
initDB().then(() => console.log('DB is initialized'));

const app = express();

app.use(cors());
app.use(express.json());
app.use('/cars', cars);
app.use('/tracks', tasks);

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(3000);
