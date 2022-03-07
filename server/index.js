// set up mongoose
const mongoose = require('mongoose');
const userModel = require('./models/usermodel');
const mongoUri = "mongodb://dbUser:dbUserPassword@cluster0-shard-00-00.jmew9.mongodb.net:27017,cluster0-shard-00-01.jmew9.mongodb.net:27017,cluster0-shard-00-02.jmew9.mongodb.net:27017/app-data?ssl=true&replicaSet=atlas-12vsnr-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(mongoUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
	console.log('Database is connected successfully');
});
mongoose.connection.on('disconnected',() => {
	console.log('Database is disconnected successfully');
})
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// set up cors
const cors = require('cors');

// set up express
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());

// set up dotenv
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

// set up uuid
const { v4: uuidv4 } = require('uuid');

// set up bcrypt
const bcrypt = require('bcrypt');

// set up nodemailer
const nodemailer = require('nodemailer');

// set up json token
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT;

// routing
app.get('/', (req, res) => {
	res.json("hello world");
})

// sign up
app.post('/signup', async (req, res) => {
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

		// get email sender’s credentials from .env
		const emailUser = process.env.EMAIL;
		const emailPass  = process.env.PASS;

		// set up nodemailer
		const transport = nodemailer.createTransport({
			service: "Gmail",
			secure: false,
			port: 25,
			auth: {
				user: emailUser,
				pass: emailPass
			},
		});

		// set up content of the email
		const mailOptions = {
			from: emailUser,
			to: sanitizedEmail,
			subject: "Please confirm your registration",
			html: `<h1>Email Confirmation</h1>
			<h2>Hello ${ username }</h2>
			<p>Thank you for signing up matcha. Please confirm your email by clicking on the following link</p>
			<a href=http://localhost:8000/confirm/${ emailToken }> Click here</a>
			</div>`,
		}

		// send the email
		transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
				res.json({ message: "Please try again" });
			}
			else {
				console.log("Email sent: " + info.response);
				res.json({ message: "Thanks for signing up, please check your email for the confirmation link" });
			}
		})
		res.status(200).json({ message: "Signup data is saved succesfully" });
	});

	// generate a token to determine if user logged in
	// secret key???
	// const token = jwt.sign(insertedUser, sanitizedEmail, {
	// 	expiresIn: 60 * 24,
	// })

	// res.status(201).json({ token, user_id: generatedUserId, username: username, email: sanitizedEmail })
})

// confirm the emailToken
app.get('/confirm/:confirmCode', (req, res) => {

	userModel.findOne({ confirm_code: req.params.confirmCode, })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}
			users.status = 'Active';

			users.save((err) => {
				if (err) {
					res.status(500).json({ message: err });
					return;
				}
				return res.status(200).json({ message: "User is actived succesfully" });
			});
		})
		.catch((e) => console.log("error", e));
})

app.listen(PORT, () => console.log("Server running on PORT " + PORT));
