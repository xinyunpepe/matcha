const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Database is connected successfully');
	})
	.catch(err => {
		console.error("Connection error", err);
		process.exit();
	})
