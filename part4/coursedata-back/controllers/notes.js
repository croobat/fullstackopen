const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (_, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

notesRouter.get('/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

notesRouter.post('/', (req, res, next) => {
  const { body } = req

  if (body.content === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then((savedNote) => {
      res.json(savedNote)
    })
    .catch((error) => next(error))

  return null
})

notesRouter.put('/:id', (req, res, next) => {
  const { body } = req

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote)
    })
    .catch((error) => next(error))
})

notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

notesRouter.put('/:id', (req, res, next) => {
  const { body } = req

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote)
    })
    .catch((error) => next(error))
})

module.exports = notesRouter
