const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const testHelper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const Mongoose = require('mongoose');
const api = supertest(app);

let token;
beforeEach(async () => {
  await Blog.deleteMany({});

  const blogs = testHelper.initialBlogs.map((b) => new Blog(b));
  await Promise.all(blogs.map((b) => b.save()));

  // initialize database and login admin user
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('tests', 10);
  const user = new User({ username: 'admin', name: 'admin', passwordHash });
  await user.save();
  const res = await api
    .post('/api/login')
    .send({ username: 'admin', name: 'admin', password: 'tests' });
  token = res.body.token;
});

describe('Tests for fetching blogs from DB', () => {
  test('check content-type of response is JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('response contains all blogs stored in DB', async () => {
    const res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(testHelper.initialBlogs.length);
  });
});

describe('toJSON transforms _id to id', () => {
  test('unique identifier property is named id not _id', async () => {
    const blogs = await testHelper.blogsFromDb();
    blogs.forEach((blog) => expect(blog.id).toBeDefined());
  });

  test('identifier _id is undefined', async () => {
    const blogs = await testHelper.blogsFromDb();
    blogs.forEach((blog) => expect(blog._id).not.toBeDefined());
  });
});

describe('Persisting blogs to DB', () => {
  test('A valid blog is added to DB by an authenticated user, succeeds with status code 201', async () => {
    const newBlog = {
      title: 'Async/await without try/catch in JavaScript ',
      author: 'Dzmitry Bayarchyk',
      url: 'https://itnext.io/async-await-without-try-catch-in-javascript-6dcdf705f8b1',
      likes: 10
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const fromDb = await testHelper.blogsFromDb();
    const titlesFromDb = fromDb.map((b) => b.title);
    expect(fromDb).toHaveLength(testHelper.initialBlogs.length + 1);
    expect(titlesFromDb).toContain(newBlog.title);
  });

  test('A valid blog cannot be added by an Unauthorized user, fails with status code 401', async () => {
    const newBlog = {
      title: 'Async/await without try/catch in JavaScript ',
      author: 'Dzmitry Bayarchyk',
      url: 'https://itnext.io/async-await-without-try-catch-in-javascript-6dcdf705f8b1',
      likes: 10
    };

    const res = await api.post('/api/blogs').send(newBlog).expect(401);

    const fromDb = await testHelper.blogsFromDb();
    const titlesFromDb = fromDb.map((b) => b.title);
    expect(res.body.error).toContain('missing or invalid token');
    expect(fromDb).toHaveLength(testHelper.initialBlogs.length);
    expect(titlesFromDb).not.toContain(newBlog.title);
  });

  test('likes property defaults to a value zero if likes is undefined for the blog', async () => {
    const blogWithoutLikes = {
      title: 'Stop Using If-Else Statements',
      author: 'Nicklas Millard',
      url: 'https://medium.com/swlh/stop-using-if-else-statements-f4d2323e6e4'
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const fromDb = await testHelper.blogsFromDb();
    const likesSetToZero = fromDb.find(
      (b) =>
        b.title === blogWithoutLikes.title &&
        b.author === blogWithoutLikes.author
    );

    expect(fromDb).toHaveLength(testHelper.initialBlogs.length + 1);
    expect(likesSetToZero.likes).toBe(0);
  });

  test('blog without title or url is not persisted, fails with status code 400', async () => {
    const invalidBlog = {
      author: 'Dzmitry Bayarchyk',
      likes: 10
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBlog)
      .expect(400);

    const fromDb = await testHelper.blogsFromDb();

    expect(fromDb).toHaveLength(testHelper.initialBlogs.length);
  });
});

describe('blog deletion', () => {
  test('blog deletion by authorized user succeeds with status code 204', async () => {
    const newblog = {
      title: 'Stop Using If-Else Statements',
      author: 'Nicklas Millard',
      url: 'https://medium.com/swlh/stop-using-if-else-statements-f4d2323e6e4',
      likes: 20
    };
    const createdByAdmin = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newblog)
      .expect(201);

    const toBeDeletedByAdmin = createdByAdmin.body;
    const currentState = await testHelper.blogsFromDb();

    await api
      .delete(`/api/blogs/${toBeDeletedByAdmin.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const finalState = await testHelper.blogsFromDb();
    expect(finalState).toHaveLength(currentState.length - 1);
  });

  test('blog deletion by an Unauthorized user fails with status code 401', async () => {
    const initialState = await testHelper.blogsFromDb();
    const toBeDeletedByUnauthorizedUser = initialState[0];

    await api
      .delete(`/api/blogs/${toBeDeletedByUnauthorizedUser.id}`)
      .expect(401);

    const finalState = await testHelper.blogsFromDb();
    expect(finalState).toHaveLength(initialState.length);
  });
});

describe('updating a specific blog', () => {
  test('updating a blog with valid id', async () => {
    const initialState = await testHelper.blogsFromDb();
    const toBeUpdated = initialState[1];
    const newLikes = { likes: 40 };
    await api
      .put(`/api/blogs/${toBeUpdated.id}`)
      .send(newLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const fromDb = await testHelper.blogsFromDb();
    const updatedBlog = fromDb.find((b) => b.id === toBeUpdated.id);

    expect(fromDb).toHaveLength(testHelper.initialBlogs.length);
    expect(updatedBlog.likes).toBe(newLikes.likes);
  });

  test('update fails with code 400 for invalid id type', async () => {
    const initialState = await testHelper.blogsFromDb();
    const newLikes = { likes: 20 };
    await api.put('/api/blogs/invalidIdType').send(newLikes).expect(400);

    const finalState = await testHelper.blogsFromDb();
    expect(finalState).toEqual(initialState);
  });
});

/*  Testing user api */

describe('tests for user api', () => {
  test('A valid user is added to DB, status code equals 200', async () => {
    const initialState = await testHelper.usersFromDb();
    const newUser = {
      username: 'brainyarck',
      name: 'Heribert Ambe',
      password: 'test1'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const finalState = await testHelper.usersFromDb();
    const usernames = finalState.map((u) => u.username);

    expect(finalState).toHaveLength(initialState.length + 1);
    expect(usernames).toContain(newUser.username);
  });
  test('Password required; request fails with status code 400', async () => {
    const initialState = await testHelper.usersFromDb();
    const invalidUser = {
      name: 'Emanga',
      username: 'ema'
    };

    const res = await api.post('/api/users').send(invalidUser).expect(400);

    const finalState = await testHelper.usersFromDb();
    const names = finalState.map((u) => u.username);

    expect(res.body.error).toContain(
      'missing or invalid password; min password length is 3'
    );
    expect(finalState).toHaveLength(initialState.length);
    expect(names).not.toContain(invalidUser.name);
  });

  test('username must be a min of 3 characters long; request fails with status code 400', async () => {
    const initialState = await testHelper.usersFromDb();
    const invalidUser = {
      password: 'test4',
      username: 'em'
    };

    const res = await api.post('/api/users').send(invalidUser).expect(400);

    const finalState = await testHelper.usersFromDb();

    expect(res.body.error).toContain(
      `\`username\` (\`${invalidUser.username}\`) is shorter than the minimum allowed length`
    );
    expect(finalState).toHaveLength(initialState.length);
  });

  test('Username must be unique, else operation fails with status code 400', async () => {
    const initialState = await testHelper.usersFromDb();
    const notUnique = {
      name: 'Emanga',
      username: 'admin',
      password: 'test3'
    };

    const res = await api.post('/api/users').send(notUnique).expect(400);

    const finalState = await testHelper.usersFromDb();
    const names = finalState.map((u) => u.username);

    expect(res.body.error).toContain('`username` to be unique');
    expect(finalState).toHaveLength(initialState.length);
    expect(names).not.toContain(notUnique.name);
  });
});

afterAll(async () => await Mongoose.connection.close());
