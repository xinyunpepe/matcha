const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config({ path: '.env' });
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('./mailer');

// app config
const app = express();
const port = process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json());

// DB config
const userModel = require('./app/models/usermodel');
mongoose
	.connect(process.env.DB_URI, {
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

// const controller = require('./app/controllers/authcontroller');

// API endpoints
app.get('/', (req, res) => {
	res.json("hello world");
})

app.post('/signup', (req, res) => {
	// const client = new MongoClient(mongoUri);
	const { username, email, password } = req.body;

	// generate unique secured userid
	const generatedUserId = uuidv4();

	const sanitizedEmail = email.toLowerCase();

	// generate hashed password
	const hashedPassword = bcrypt.hashSync(password, 10);

	// generate a token to send in the comfirmation email
	const emailToken = jwt.sign({ sanitizedEmail: sanitizedEmail }, 'secret');

	const data = {
		user_id: generatedUserId,
		username: username,
		email: sanitizedEmail,
		hashed_password: hashedPassword,
		confirm_code: emailToken
	}

	const users = new userModel(data);

	users.save((err) => {
		if (err) {
			res.status(500).json({ message: err });
			return;
		}
		res.send({ message: "Please check your email" });

		nodemailer.sendConfirmEmail(
			username,
			sanitizedEmail,
			emailToken
		);
	});

	// generate a token to determine if user logged in
	// secret key???
	// const token = jwt.sign(insertedUser, sanitizedEmail, {
	// 	expiresIn: 60 * 24,
	// })

	// res.status(201).json({ token, user_id: generatedUserId, username: username, email: sanitizedEmail })
})

// app.get('/confirm/:confirmCode', controller.verifyUser);
app.get('/confirm/:confirmCode', (req, res) => {
	userModel.findOne({ confirm_code: req.params.confirmCode, })
		.then((users) => {
			// console.log(users);
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}
			users.status = 'Active';

			users.save((err) => {
				if (err) {
					console.log(error);
					res.status(500).json({ message: err });
					return;
				}
				console.log("User is actived successfully");
				return res.status(200).redirect('http://localhost:3000/welcome');
			});
		})
		.catch((err) => {
			console.log("Error: ", err)
		});
})


// listener
app.listen(port, () => {
	console.log("Server running on PORT " + port);
});
