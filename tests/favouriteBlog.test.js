const listHelper = require('../utils/list_helper');

describe('favourite blog', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '4a422aa71b54a676234d17f7',
      title: 'Stop Using If-Else Statements',
      author: 'Nicklas Millard',
      url: 'https://medium.com/swlh/stop-using-if-else-statements-f4d2323e6e4',
      likes: 17,
      __v: 0
    },
    {
      _id: '3a422aa71b54a676234d17f6',
      title: 'Async/await without try/catch in JavaScript ',
      author: 'Dzmitry Bayarchyk',
      url: 'https://itnext.io/async-await-without-try-catch-in-javascript-6dcdf705f8b1',
      likes: 10,
      __v: 0
    },
    {
      _id: '2a422aa71b54a676234d17f5',
      title: 'Switching from OOP to Functional Programming',
      author: 'Oleksii Avramenko',
      url: 'https://medium.com/@olxc/switching-from-oop-to-functional-programming-4187698d4d3',
      likes: 6,
      __v: 0
    },
    {
      _id: '6a422aa71b54a676234d17f3',
      title: 'A practical guide to writing more functional JavaScript',
      author: 'Nadeesha Cabral',
      url: 'medium.com/@nadeesha/a-practical-guide-to-writing-more-functional-javascript-db49409f71',
      likes: 17,
      __v: 0
    },
    {
      _id: '9a422aa71b54a676234d17f9',
      title: 'Setting up JWT Bearer authentication in ASP.NET Core',
      author: 'Nicklas Millard',
      url: 'https://medium.com/dev-genius/jwt-bearer-authentication-for-machine-to-machine-and-single-page-applications-1c8ba1211a90',
      likes: 10,
      __v: 0
    },
    {
      _id: '8a422aa71b54a676234d17f1',
      title: 'Introduction Authentication',
      author: 'Nicklas Millard',
      url: 'https://medium.com/dev-genius/brief-overview-of-asp-net-core-authentication-451e630bc42d',
      likes: 30,
      __v: 0
    },
    {
      _id: '7a422aa71b54a676234d17f2',
      title: 'Don’t Use Database Generated IDs in Domain Entities',
      author: 'Nicklas Millard',
      url: 'https://medium.com/swlh/dont-use-database-generated-ids-d703d35e9cc4',
      likes: 8,
      __v: 0
    },
    {
      _id: '1a422aa71b54a676234d17f9',
      title: 'Improve your GraphQL schema with Relay Specification',
      author: 'Dzmitry Bayarchyk',
      url: 'https://itnext.io/improve-your-graphql-schema-with-the-relay-specification-8952d06998eb',
      likes: 55,
      __v: 0
    },
    {
      _id: '1a422aa71b54a676234d17f4',
      title: 'Type Classes Explained',
      author: 'Oleksii Avramenko',
      url: 'https://medium.com/@olxc/type-classes-explained-a9767f64ed2c',
      likes: 55,
      __v: 0
    }
  ];

  test('blog with most likes', () => {
    const result = listHelper.favouriteBlog(blogs);
    expect(result).toEqual({
      title: 'Improve your GraphQL schema with Relay Specification',
      author: 'Dzmitry Bayarchyk',
      likes: 55
    });
  });

  test('no favourite blog for an empty list', () => {
    const result = listHelper.favouriteBlog([]);
    expect(result).toBe('Empty blog list!');
  });
});
