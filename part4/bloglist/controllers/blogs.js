const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  // if no likes, set to 0
  if (!blog.likes) blog.likes = 0

  // if no title or url, return 400
  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  return blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogsRouter
