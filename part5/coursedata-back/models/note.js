const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
	content: {
		type: String,
		minlength: 5,
		required: true,
	},
	important: Boolean,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

noteSchema.set('toJSON', {
	transform: (_, returnedObject) => {
		const object = { ...returnedObject };
		object.id = object._id.toString();
		delete object._id;
		delete object.__v;
		return object;
	},
});

module.exports = mongoose.model('Note', noteSchema);
