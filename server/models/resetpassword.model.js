const mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({
	user_id: {
		type: String,
		ref: "users",
		require: true
	},
	email: {
		type: String,
		ref: "users",
		require: true
	},
	token: {
		type: String,
		require: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		index: { expires: 1800 }
	},
});

const resetPasswordModel = mongoose.model('resetPasswords', resetPasswordSchema);

module.exports = resetPasswordModel;
