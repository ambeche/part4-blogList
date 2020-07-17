const supertest = require('supertest')
const app = require('../app')
const testHelper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
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

  test('blog without title or url is not persisted, fails with status code 400', async () => {
    const invalidBlog = {
      author: 'Dzmitry Bayarchyk',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .send(invalidBlog)
      .expect(400)

    const fromDb = await testHelper.blogsFromDb()

    expect(fromDb).toHaveLength(testHelper.initialBlogs.length)
  })
})

describe('blog deletion', () => {
  test('deleting a blog by id, status code 204 implies success', async () => {
    const initialState = await testHelper.blogsFromDb()
    const toBeDeleted = initialState[0]
    await api
      .delete(`/api/blogs/${toBeDeleted.id}`)
      .expect(204)

    const finalState = await testHelper.blogsFromDb()
    expect(finalState).toHaveLength(testHelper.initialBlogs.length - 1)
    expect(finalState).not.toContainEqual(toBeDeleted)
  })
})

describe('updating a specific blog', () => {
  test('updating a blog with valid id', async () => {
    const initialState = await testHelper.blogsFromDb()
    const toBeUpdated = initialState[1]
    const newLikes = { likes: 40 }
    await api
      .put(`/api/blogs/${toBeUpdated.id}`)
      .send(newLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const fromDb = await testHelper.blogsFromDb()
    const updatedBlog = fromDb.find(b => b.id === toBeUpdated.id)

    expect(fromDb).toHaveLength(testHelper.initialBlogs.length)
    expect(updatedBlog.likes).toBe(newLikes.likes)
  })

  test('update fails with code 400 for invalid id type', async () => {
    const initialState = await testHelper.blogsFromDb()
    const newLikes = { likes: 20 }
    await api
      .put('/api/blogs/invalidIdType')
      .send(newLikes)
      .expect(400)

    const finalState = await testHelper.blogsFromDb()
    expect(finalState).toEqual(initialState)
  })

  describe('tests for user api', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const user = new User({ username: 'admin', name: 'admin', password: 'tests' })
      await user.save()
    })

    test('A valid user is added to DB, status code equals 200', async () => {
      const initialState = await testHelper.usersFromDb()
      const newUser = {
        username: 'brainyarck',
        name: 'Heribert Ambe',
        password: 'test1'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const finalState = await testHelper.usersFromDb()
      const usernames = finalState.map(u => u.username)

      expect(finalState).toHaveLength(initialState.length + 1)
      expect(usernames).toContain(newUser.username)
    })
  })
})

afterAll( async () => await Mongoose.connection.close())