const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(express.json())
app.use(middleware.morganLogger(':method :url :status :res[content-length] - :response-time ms :data'))

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownRoute)
app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})