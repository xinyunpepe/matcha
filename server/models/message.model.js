const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
	timestamp: {
		type: Date,
		createdAt: 'created_at'
	},
	from_userId: {
		type: String,
		ref: "users",
		require: true
	},
	to_userId: {
		type: String,
		ref: "users",
		require: true
	},
	message: {
		type: String
	}
});

const messageModel = mongoose.model('messages', messagesSchema);

module.exports = messageModel;
