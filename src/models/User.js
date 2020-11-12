const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	client_user_id: {
		type: String,
		required: true,
	},
	client_id: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	institution_id: {
		type: String,
		default: null,
	},
	item_id: {
		type: String,
		default: null,
	},
});

module.exports = mongoose.model('user', UserSchema);
