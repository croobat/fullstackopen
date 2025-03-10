const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1, name: 1, id: 1,
  })

  return response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const {
    title, author, url, likes,
  } = request.body

  const { user } = request

  if (!user) {
    return response.status(401).json({ error: 'user authentication required' })
  }

  // if no title or url, return 400
  if (!title || !url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  if (!request || !request.token) return response.status(401).json({ error: 'token missing or invalid' })

  const { user } = request
  const { id } = request.params

  const blog = await Blog.findById(id)
  if (!blog) return response.status(404).json({ error: 'blog not found' })

  if (!(user._id.toString() === blog.user.toString())) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndDelete(id)
  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })

  response.json(updatedBlog)
})

module.exports = blogsRouter
