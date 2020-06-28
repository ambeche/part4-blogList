const logger = require('../utils/logger')

const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((acc, b) => acc + b.likes, 0)

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 'Empty blog list!'
  }
  const mostLiked = blogs.map((b) => b.likes).reduce((a, b) => Math.max(a, b))
  const favourite = blogs.find((b) => b.likes === mostLiked)
  logger.info(favourite)

  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0 ) return 'List is empty!'

  const authors = blogs.map(b => b.author)
  let counter = {}
  let mostBlogger = {}
  let current = 0
  for (let i = 0; i < blogs.length; i++) {
    let author = authors[i]
    counter[author] === undefined ? counter[author] = 1 : counter[author] += 1
    if (counter[author] > current) {
      current = counter[author]
      mostBlogger.author = authors[i]
      mostBlogger.blogs = counter[authors[i]]
    }
  }

  logger.info(mostBlogger)

  return mostBlogger
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
}
