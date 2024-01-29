require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const Note = require('./models/note');

const requestLogger = (req, _, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
};

const unknownEndpoint = (_, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(requestLogger);
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

let notes = [
  {
    id: 1,
    content: 'HTML is easy hola soy tony',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get('/', (_, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (_, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then((note) => {
    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  });
});

app.post('/api/notes', (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.put('/api/notes/:id', (req, res) => {
  // updated note in request body
  const updatedNote = req.body;

  // find note by id
  const id = Number(req.params.id);
  const oldNote = notes.find((note) => note.id === id);

  // if note exists, update it
  if (oldNote) {
    const newNote = { ...oldNote, ...updatedNote };
    notes = notes.map((note) => (note.id !== id ? note : newNote));
    res.json(newNote);
  } else {
    // if note doesn't exist, error
    res.statusMessage = `Note with id ${id} not found`;
    res.status(404).end();
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
