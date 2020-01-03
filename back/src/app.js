const express = require('express');

const app = express();

const cars = require('./routes/cars');
const tasks = require('./routes/tasks');

app.use(express.json());

app.use('/cars', cars);
app.use('/tasks', tasks);

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(3000);