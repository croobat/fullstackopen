const jwt = require('jsonwebtoken');

const notesRouter = require('express').Router();
const Note = require('../models/note');
const User = require('../models/user');

const getTokenFrom = request => {
	const authorization = request.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7);
	}
	return null;
};

// async/await instead of promises
// notesRouter.get('/', (_, res) => {
//   Note.find({}).then((notes) => {
//     res.json(notes)
//   })
// })
notesRouter.get('/', async (request, response) => {
	const notes = await Note.find({}).populate('user', { username: 1, name: 1 });
	response.json(notes);
});

notesRouter.get('/:id', async (req, res) => {
	const note = await Note.findById(req.params.id);

	if (note) {
		res.json(note);
	} else {
		res.status(404).end();
	}
});

notesRouter.post('/', async (req, res) => {
	const { body } = req;

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
	if (!decodedToken.id) {
		return res.status(401).json({ error: 'token missing or invalid' });
	}
	const user = await User.findById(decodedToken.id);

	const note = new Note({
		content: body.content,
		important: body.important || false,
		user: user.id,
	});

	if (!body.content) {
		return res.status(400).json({
			error: 'content missing',
		});
	}

	const savedNote = await note.save();
	user.notes = user.notes.concat(savedNote._id);
	await user.save();

	return res.status(201).json(savedNote);
});

notesRouter.put('/:id', (req, res, next) => {
	const { body } = req;

	const note = {
		content: body.content,
		important: body.important,
	};

	Note.findByIdAndUpdate(req.params.id, note, { new: true })
		.then(updatedNote => {
			res.json(updatedNote);
		})
		.catch(error => next(error));
});

notesRouter.delete('/:id', async (req, res) => {
	await Note.findByIdAndDelete(req.params.id);
	res.status(204).end();
});

notesRouter.put('/:id', (req, res, next) => {
	const { body } = req;

	const note = {
		content: body.content,
		important: body.important,
	};

	Note.findByIdAndUpdate(req.params.id, note, { new: true })
		.then(updatedNote => {
			res.json(updatedNote);
		})
		.catch(error => next(error));
});

module.exports = notesRouter;
