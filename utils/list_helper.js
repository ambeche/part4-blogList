const logger = require('../utils/logger')
const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((acc, b) => acc + b.likes, 0)

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return 'Empty blog list!'

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

  const mostBlogger = _
    .chain( blogs.concat())
    .sortBy('author')
    .countBy('author')
    .toPairs()
    .maxBy(_.last)
    .value()

  logger.info(mostBlogger)

  return {
    author: mostBlogger[0],
    blogs: mostBlogger[1]
  }
}

const mostLikes = (blogs) => {
  const mostLiked = favouriteBlog(blogs)
  if ( typeof mostLiked === 'string') return mostLiked

  const authorBlogs = blogs.filter(b => b.author === mostLiked.author)
  const likesForAuthor = totalLikes(authorBlogs)
  logger.info(`Author: ${mostLiked.author}, Likes: ${likesForAuthor}`)

  return {
    author:mostLiked.author,
    likes: likesForAuthor
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
