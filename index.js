const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const config = require('./utils/config')
const mongoose = require('mongoose')

morgan.token('data', (req) =>  JSON.stringify(req.body))

mongoose.set('useFindAndModify', false)

const blogSchema = mongoose.Schema({
  title: {
      type: String,
      required: true,
    },
  author:{
       type: String,
       required: true,
    },
  url: {
      type: String,
      required: true,
    },
  likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map( blog => blog.toJSON()))
    })
})

app.post('/api/blogs', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result.toJSON())
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }
    next(error)
}

const unknownRoute = (req, res) => {
    res.status(404).send('No Resource, Endpoint Unknown')
}

app.use(unknownRoute)
app.use(errorHandler)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})