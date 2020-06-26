const dummy = (blogs) =>  1

const totalLikes = (blogs) => blogs.reduce((acc, b) => acc + b.likes, 0)

module.exports = {
  dummy,
  totalLikes,
}
