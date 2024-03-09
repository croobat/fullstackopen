const logger = require('./logger')

const requestLogger = (req, _, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (_, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, _, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)

  return null
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
