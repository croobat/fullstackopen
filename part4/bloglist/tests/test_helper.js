const Blog = require('../models/blog')

const initialBlogs = [
  {
    id: '5a422a851',
    title: '100 years of solitude',
    author: 'Gabriel Garcia Marquez',
    url: 'https://www.example.com',
    likes: 10,
  },
  {
    id: '5a422a851b',
    title: 'The art of war',
    author: 'Sun Tzu',
    url: 'https://www.gnu.org',
    likes: 15,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon', author: 'Sun Tzu', url: 'https://www.gnu.org', likes: 15,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const getValidToken = async (api) => {
  const response = await api
    .post('/api/login')
    .send({ username: 'test', password: 'test' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  return response.body.token
}

module.exports = {
  nonExistingId, initialBlogs, blogsInDb, getValidToken,
}
