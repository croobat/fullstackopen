const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const object = { ...returnedObject }
    object.id = returnedObject._id.toString()
    delete object._id
    delete object.__v
    delete object.passwordHash
    return object
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
