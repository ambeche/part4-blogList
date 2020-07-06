const supertest = require('supertest')
const app = require('../app')
const testHelper = require('./test_helper')
const Blog = require('../models/blog')
const Mongoose = require('mongoose')

const api = supertest(app)

beforeEach( async () => {
  await Blog.deleteMany({})

  const blogs = testHelper.initialBlogs.map(b => new Blog (b))
  await Promise.all(blogs.map(b => b.save()))
})

describe('Tests for fetching blogs from DB', () => {
  test('check content-type of response is JSON', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('response contains all blogs stored in DB', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(testHelper.initialBlogs.length)
  })
})

describe('toJSON transforms _id to id', () => {
  test('unique identifier property is named id not _id', async () => {
    const blogs = await testHelper.blogsFromDb()
    blogs.forEach(blog => expect(blog.id).toBeDefined())
  })

  test('identifier _id is undefined', async () => {
    const blogs = await testHelper.blogsFromDb()
    blogs.forEach(blog => expect(blog._id).not.toBeDefined())
  })
})

afterAll( async () => await Mongoose.connection.close())