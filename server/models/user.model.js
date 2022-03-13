const mongoose = require('mongoose');

// create an schema
const userSchema = new mongoose.Schema({
	user_id: String,
	username: {
		type: String,
		unique: [true, 'Username exists already'],
		required: [true, 'Username required']
	},
	email: {
		type: String,
		unique: [true, 'Email exists already'],
		required: [true, 'Email required'],
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: ['Pending', 'Active'],
		default: 'Pending'
	},
	confirm_code: {
		type: String,
		unique: true,
		required: true
	},
	first_name: String,
	last_name: String,
	birth_day: Number,
	birth_month: Number,
	birth_year: Number,
	show_gerder: Boolean,
	gender_identity: String,
	gender_interest: String,
	url: String,
	about: String,
	matches: {
		type: [{
			user_id: { type: String }
		}]
	}
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
