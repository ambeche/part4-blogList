const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithMoreBlogs = [
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
      likes: 10,
      __v: 0
    },
    {
      _id: '3a422aa71b54a676234d17f6',
      title: 'Async/await without try/catch in JavaScript ',
      author: 'Dzmitry Bayarchyk',
      url: 'https://itnext.io/async-await-without-try-catch-in-javascript-6dcdf705f8b1',
      likes: 12,
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
      _id: '1a422aa71b54a676234d17f4',
      title: 'Switching from OOP to Functional Programming',
      author: 'Oleksii Avramenko',
      url: 'https://medium.com/@olxc/switching-from-oop-to-functional-programming-4187698d4d3',
      likes: 7,
      __v: 0
    },
    {
      _id: '6a422aa71b54a676234d17f3',
      title: 'A practical guide to writing more functional JavaScript',
      author: 'Nadeesha Cabral',
      url: 'medium.com/@nadeesha/a-practical-guide-to-writing-more-functional-javascript-db49409f71',
      likes: 9,
      __v: 0
    },
  ]
  const listWithOneBlog = [listWithMoreBlogs[0]]

  test('is zero for empty list', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('for a larger list equals the sum of the likes of all the blogs', () => {
    const result = listHelper.totalLikes(listWithMoreBlogs)
    expect(result).toBe(49)
  })
})