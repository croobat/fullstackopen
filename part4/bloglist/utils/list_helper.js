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

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs
}
