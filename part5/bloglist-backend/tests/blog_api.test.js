const {
  test, describe, beforeEach, after,
} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const password = 'test'
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({ username: 'test', passwordHash })
  await user.save()

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('when there is initially some blogs stored', () => {
  describe('login', () => {
    test('a valid user can login', async () => {
      await api
        .post('/api/login')
        .send({ username: 'test', password: 'test' })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('an invalid user cannot login', async () => {
      await api
        .post('/api/login')
        .send({ username: 'test', password: 'wrong' })
        .expect(401)
    })

    test('a user can be created', async () => {
      const newUser = {
        username: 'newuser',
        name: 'New User',
        password: 'password',
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('viewing', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('blogs are returned with correct amount', async () => {
      const response = await api.get('/api/blogs')
      assert.equal(response.body.length, helper.initialBlogs.length)
    })

    test('blog id is named id instead of _id', async () => {
      const response = await api.get('/api/blogs')
      assert.ok(response.body[0].id)
    })

    test('if likes is missing, it is set to 0', async () => {
      const newBlog = {
        title: 'new blog',
        url: 'http://newblog.com',
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getValidToken(api)}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      assert.equal(response.body[2].likes, 0)
    })
  })

  describe('adding', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'new blog',
        url: 'http://newblog.com',
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getValidToken(api)}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const titles = response.body.map((r) => r.title)

      assert.ok(titles.includes('new blog'))
    })

    test('if title or url is missing, return 400', async () => {
      const newBlog = {}
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getValidToken(api)}`)
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deleting', () => {
    test.only('a blog can be deleted', async () => {
      const newBlog = {
        title: 'new test blog',
        url: 'http://newblog.com',
      }

      const newBlogResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getValidToken(api)}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const { id } = newBlogResponse.body

      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${await helper.getValidToken(api)}`)
        .expect(204)

      const response = await api.get('/api/blogs')
      const titles = response.body.map((r) => r.title)
      assert.ok(!titles.includes('new test blog'))
    })
  })

  describe('updating', () => {
    test('a blog can be updated', async () => {
      const response = await api.get('/api/blogs')
      const { id } = response.body[0]

      const updatedBlog = { title: 'updated title', url: 'http://updatedurl.com', likes: 100 }

      await api
        .put(`/api/blogs/${id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map((r) => r.title)
      assert.ok(titles.includes('updated title'))
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
