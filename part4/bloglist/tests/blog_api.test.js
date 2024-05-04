const {
  test, describe, beforeEach, after,
} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('when there is initially some blogs stored', () => {
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
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deleting', () => {
    test('a blog can be deleted', async () => {
      const response = await api.get('/api/blogs')
      const { id } = response.body[0]
      console.log('response.body)', response.body)

      await api
        .delete(`/api/blogs/${id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.equal(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
