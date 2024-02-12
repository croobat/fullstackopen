const _ = require('lodash')

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, blogs[0])
}

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, 'author')
  const author = _.maxBy(Object.keys(authors), (author) => authors[author])
  return { author, blogs: authors[author] }
}

const mostLikes = (blogs) => {
  const authors = _.groupBy(blogs, 'author')
  const likes = _.mapValues(authors,
    (blogs) => blogs.reduce(
      (sum, blog) => sum + blog.likes, 0))
  const author = _.maxBy(Object.keys(likes), (author) => likes[author])
  return { author, likes: likes[author] }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
