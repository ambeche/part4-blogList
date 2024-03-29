const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');
const path = require('path');

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => logger.info('connected to', config.MONGODB_URI))
  .catch((err) => logger.err(err.message));

app.use(cors());
app.use(express.json());
app.use('/', express.static('react-ui/app-1'));
app.use('/version-2', express.static('react-ui/app-2-with-redux-styles'));

app.use(
  middleware.morganLogger(
    ':method :url :status :res[content-length] - :response-time ms :data'
  )
);

app.use(middleware.tokenExtractor);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownRoute);
app.use(middleware.errorHandler);

module.exports = app;
