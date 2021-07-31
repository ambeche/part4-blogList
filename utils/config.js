require('dotenv').config();

let { PORT, MONGODB_URI, TEST_MONGODB_URI, NODE_ENV } = process.env;

if (NODE_ENV === 'test') MONGODB_URI = TEST_MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT
};
