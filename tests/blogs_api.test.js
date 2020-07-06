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

afterAll( async () => await Mongoose.connection.close())