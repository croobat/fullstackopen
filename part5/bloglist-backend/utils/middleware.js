const jwt = require('jsonwebtoken')

const User = require('../models/user')
const logger = require('./logger')

const errorHandler = (error, _, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  } if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'token missing or invalid',
    })
  } if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    })
  }

  next(error)

  return null
}

const tokenExtractor = (req, _, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }

  next()
}

const userExtractor = async (req, _, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (decodedToken.id) {
    const userId = decodedToken.id

    req.user = await User.findById(userId)
  }

  return next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
}
