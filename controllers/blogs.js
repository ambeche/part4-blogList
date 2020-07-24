const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const decodeToken = async req => await jwt.verify(req.token, process.env.ENCODING)

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const blog = req.body

  const decodedToken =  await decodeToken(req)
  if (!decodedToken.id) return res.status(401).json({ error: 'token missing or invalid' })

  const user = await User.findById(decodedToken.id)

  if (blog.likes === undefined) blog.likes = 0

  blog.user = user._id
  const newblog = new Blog(blog)

  const savedBlog = await newblog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog.toJSON())
})

blogsRouter.put('/:id', async (req, res) => {
  const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })
  res.json(updated.toJSON())
})

blogsRouter.delete('/:id', async (req, res) => {
  const decodedToken = await decodeToken(req)
  if (!decodedToken) return res.status(401).json({ error: 'token missing or invalid' })

  const blog = await Blog.findById(req.params.id)
  const user = await User.findById(decodedToken.id)
  const isVerified = blog && user ? blog.user.toString() === user.id.toString() : false

  if (!isVerified) return res.status(401).json({ error: 'Blog deletion is only authorized to the author!' })

  await Blog.findByIdAndRemove(req.params.id)
  user.blogs = user.blogs.filter( b => b.id.toString() !== req.params.id.toString())
  await user.save()
  res.status(204).end()
})

module.exports = blogsRouter