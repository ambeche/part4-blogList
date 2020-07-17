const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs.map( blog => blog.toJSON()))
})

blogsRouter.post('/', async (req, res) => {
  const blog = req.body
  if (blog.likes === undefined) blog.likes = 0

  const users = await User.find({})
  const user = users ? users[3] : null

  user? blog.user = user._id : res.status(400).send('missing id')
  const newblog = new Blog(blog)

  const savedBlog = await newblog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog.toJSON())
})

blogsRouter.put('/:id', async (req, res) => {
  const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query',
  })
  res.json(updated.toJSON())
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter