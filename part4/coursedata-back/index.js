const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

// const express = require('express')
// const cors = require('cors')
// const Note = require('./models/note')

// const requestLogger = (req, _, next) => {
//   console.log('Method:', req.method)
//   console.log('Path:  ', req.path)
//   console.log('Body:  ', req.body)
//   console.log('---')
//   next()
// }

// const unknownEndpoint = (_, res) => {
//   res.status(404).send({ error: 'unknown endpoint' })
// }

// const errorHandler = (error, _, res, next) => {
//   console.error(error.message)

//   if (error.name === 'CastError') {
//     return res.status(400).send({ error: 'malformatted id' })
//   } else if (error.name === 'ValidationError') {
//     return res.status(400).json({ error: error.message })
//   }

//   next(error)
// }

// app.use(express.static('dist'))
// app.use(express.json())
// app.use(requestLogger)
// app.use(cors())
// // error handler middleware should be the last loaded middleware
// app.use(errorHandler)

// app.get('/', (_, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

// app.get('/api/notes', (_, res) => {
//   Note.find({}).then((notes) => {
//     res.json(notes)
//   })
// })

// app.get('/api/notes/:id', (req, res, next) => {
//   Note.findById(req.params.id)
//     .then((note) => {
//       if (note) {
//         res.json(note)
//       } else {
//         res.status(404).end()
//       }
//     })
//     .catch((error) => next(error))
// })

// app.post('/api/notes', (req, res, next) => {
//   const body = req.body

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   })

//   note
//     .save()
//     .then((savedNote) => {
//       res.json(savedNote)
//     })
//     .catch((error) => next(error))
// })

// app.put('/api/notes/:id', (req, res, next) => {
//   const { content, important } = req.body

//   Note.findByIdAndUpdate(req.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
//     .then((updatedNote) => {
//       res.json(updatedNote)
//     })
//     .catch((error) => next(error))
// })

// app.delete('/api/notes/:id', (req, res, next) => {
//   Note.findByIdAndDelete(req.params.id)
//     .then(() => {
//       res.status(204).end()
//     })
//     .catch((error) => next(error))
// })

// app.use(unknownEndpoint)

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
