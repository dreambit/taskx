const express = require('express');
const cors = require('cors');
const { ValidationError } = require('@hapi/joi/lib/errors');

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

// eslint-disable-next-line
app.use((err, req, res, next) => {
  const error = err.error || err; // err.error is joi error

  console.error(error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: error.message
    });
  }

  res.sendStatus(500);
});

app.listen(3000);
