const express = require('express');
const path = require("path");
const app = express();
const ApiClientError = require('./utils/ApiClientError');
const ErrorHandler = require('./utils/ErrorHandler');

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use('/docs', express.static(path.resolve(__dirname + '/../docs')));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from the API'
  });
});

// Api Routes
app.use('/api', require('./api/Router'));

// Respond to all unknown route with 404 not found
app.all('*', (req, res, next) => {
  next(new ApiClientError('Route does not exists.', 404));
});

app.use(ErrorHandler.error);

module.exports = app;