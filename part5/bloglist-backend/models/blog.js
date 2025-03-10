const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const object = { ...returnedObject }
    object.id = returnedObject._id.toString()
    delete object._id
    delete object.__v
    return object
  },
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
