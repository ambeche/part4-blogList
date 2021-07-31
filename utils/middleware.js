const morganLogger = require('morgan');
const logger = require('./logger');

morganLogger.token('data', (req) => JSON.stringify(req.body));

const errorHandler = (error, req, res, next) => {
  logger.err(error.message);
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'CastError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'missing or invalid token' });
  }
  next(error);
};

const unknownRoute = (req, res) => {
  res.status(404).send('No Resource, Endpoint Unknown');
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }

  next();
};

module.exports = { morganLogger, errorHandler, unknownRoute, tokenExtractor };
