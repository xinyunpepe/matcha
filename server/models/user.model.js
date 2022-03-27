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
	age: Number,
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
	location: {
		type: {
			type: String,
			default: 'Point',
		},
		coordinates: {
			type: [Number]
		},
	},
	geographical_area: String,
	distance: Number,
	age_range: {
		type: Array,
		default: []
	},
	passions: {
		type: Array,
		default: []
	},
	matches: {
		type: Array,
		default: []
	},
	more_url: {
		type: Array,
		default: []
	}
});

const userModel = mongoose.model('users', userSchema);

userSchema.index({ location : "2dsphere" });

module.exports = userModel;
