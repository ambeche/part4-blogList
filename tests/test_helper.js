const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'Introduction Authentication',
    author: 'Nicklas Millard',
    url: 'https://medium.com/dev-genius/brief-overview-of-asp-net-core-authentication-451e630bc42d',
    likes: 30
  },
  {
    title: 'Don’t Use Database Generated IDs in Domain Entities',
    author: 'Nicklas Millard',
    url: 'https://medium.com/swlh/dont-use-database-generated-ids-d703d35e9cc4',
    likes: 8
  },
  {
    title: 'Improve your GraphQL schema with Relay Specification',
    author: 'Dzmitry Bayarchyk',
    url: 'https://itnext.io/improve-your-graphql-schema-with-the-relay-specification-8952d06998eb',
    likes: 55
  }
];

const blogsFromDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

const usersFromDb = async () => {
  const users = await User.find({});
  return users.map((b) => b.toJSON());
};

module.exports = {
  initialBlogs,
  blogsFromDb,
  usersFromDb
};
