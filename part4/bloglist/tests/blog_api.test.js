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

describe('blogs api', () => {
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

  after(async () => {
    await mongoose.connection.close()
  })
})
