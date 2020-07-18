const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( () => logger.info('connected to', config.MONGODB_URI))
  .catch( err => logger.err(err.message))

app.use(cors())
app.use(express.json())
app.use(middleware.morganLogger(':method :url :status :res[content-length] - :response-time ms :data'))

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownRoute)
app.use(middleware.errorHandler)

module.exports = app