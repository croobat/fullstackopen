const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: '100 years of solitude',
    author: 'Gabriel Garcia Marquez',
    url: 'https://www.example.com',
    likes: 10,
  },
  {
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

module.exports = {
  nonExistingId, initialBlogs, blogsInDb,
}
