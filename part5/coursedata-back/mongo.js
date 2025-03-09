const mongoose = require('mongoose');

if (process.argv.length < 3) {
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://tony:${password}@cluster0.ajenvwu.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url).then(() => {
	const noteSchema = new mongoose.Schema({
		content: String,
		important: Boolean,
	});

	const Note = mongoose.model('Note', noteSchema);

	Note.find({ important: true }).then(() => {
		mongoose.connection.close();
	});
});
