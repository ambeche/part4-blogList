const testingRouter = require('express').Router
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post( '/reset', async (req, res) => {
  User.deleteMany({})
  Blog.deleteMany({})

  res.status(204)
})

module.exports = testingRouter