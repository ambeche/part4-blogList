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

describe('Persisting blogs to DB', () => {
  test('A valid blog is added to DB', async () => {
    const newBlog = {
      title: 'Async/await without try/catch in JavaScript ',
      author: 'Dzmitry Bayarchyk',
      url: 'https://itnext.io/async-await-without-try-catch-in-javascript-6dcdf705f8b1',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const fromDb = await testHelper.blogsFromDb()
    fromDb.forEach(b => delete b.id)
    expect(fromDb).toHaveLength(testHelper.initialBlogs.length + 1)
    expect(fromDb).toContainEqual(newBlog)
  })

  test('likes property defaults to a value zero if likes is undefined for the blog', async () => {
    const blogWithoutLikes = {
      title: 'Stop Using If-Else Statements',
      author: 'Nicklas Millard',
      url: 'https://medium.com/swlh/stop-using-if-else-statements-f4d2323e6e4',
    }
    await api
      .post('/api/blogs')
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const fromDb = await testHelper.blogsFromDb()
    const likesSetToZero = fromDb.find(b => b.title === blogWithoutLikes.title && b.author === blogWithoutLikes.author)

    expect(fromDb).toHaveLength(testHelper.initialBlogs.length + 1)
    expect(likesSetToZero.likes).toBe(0)
  })
})

afterAll( async () => await Mongoose.connection.close())