const express = require('express');

const cors = require('cors');
require('dotenv').config({ path: '.env' });
// const { v4: uuidv4 } = require('uuid');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('./mailer');

// app config
const app = express();
const port = process.env.PORT;

// import routes
const authRoutes = require('./routes/auth.routes');

// middlewares
app.use(cors());
app.use(express.json());
app.use(authRoutes);

// DB config
require('./database/connectDB');
// const userModel = require('./models/usermodel');

// API endpoints
app.get('/', (req, res) => {
	res.json("hello world");
})

// app.post('/signup', (req, res) => {
// 	// const client = new MongoClient(mongoUri);
// 	const { username, email, password } = req.body;

// 	// generate unique secured userid
// 	const generatedUserId = uuidv4();

// 	const sanitizedEmail = email.toLowerCase();

// 	// generate hashed password
// 	const hashedPassword = bcrypt.hashSync(password, 10);

// 	// generate a token to send in the comfirmation email
// 	const emailToken = jwt.sign({ email: sanitizedEmail }, process.env.EMAIL_TOKEN);

// 	const data = {
// 		user_id: generatedUserId,
// 		username: username,
// 		email: sanitizedEmail,
// 		hashed_password: hashedPassword,
// 		confirm_code: emailToken
// 	}

// 	const users = new userModel(data);

// 	users.save((err) => {
// 		if (err) {
// 			res.status(500).json({ message: err });
// 			return;
// 		}
// 		res.send({ message: "Please check your email" });

// 		nodemailer.sendConfirmEmail(
// 			username,
// 			sanitizedEmail,
// 			emailToken
// 		);
// 	});
// })

// // app.get('/confirm/:confirmCode', controller.verifyUser);
// app.get('/confirm/:confirmCode', (req, res) => {
// 	userModel.findOne({ confirm_code: req.params.confirmCode })
// 		.then((users) => {
// 			// console.log(users);
// 			if (!users) {
// 				return res.status(404).send("User Not found");
// 			}
// 			else if (users.status === 'Active') {
// 				return res.status(200).send('User has been already verified. Please Login');
// 			}
// 			else {
// 				users.status = 'Active';
// 				users.save((err) => {
// 					if (err) {
// 						console.log(error);
// 						res.status(500).json({ message: err });
// 						return;
// 					}
// 					// cookie
// 					const token = jwt.sign({ email: sanitizedEmail }, process.env.COOKIE_TOKEN, {
// 						expiresIn: 60 * 24
// 					})

// 					console.log("User is actived successfully");
// 					return res.status(201).json({ token, email: sanitizedEmail });
// 					return res.status(200).redirect('http://localhost:3000/onboarding');
// 				});
// 			}
// 		})
// 		.catch((err) => {
// 			console.log("Error: ", err)
// 		});
// })

// app.post('/login', (req, res) => {
// 	userModel.findOne({ email: req.body.email })
// 		.then((users) => {
// 			// console.log(users);
// 			if (!users) {
// 				return res.status(404).json({ message: "User not found" });
// 			}
// 			const correctPassword = bcrypt.compareSync(req.body.password, users.hashed_password);
// 			if (!correctPassword) {
// 				return res.status(400).json({ message: "Invalid password" });
// 			}
// 			if (users.status != "Active") {
// 				return res.status(401).json({ message: "Pending Account. Please verify your Email" });
// 			}
// 			const accessToken = jwt.sign({ email: req.body.email }, process.env.ACESS_TOKEN, {
// 				expiresIn: 60 * 24
// 			})
// 			console.log("User is logged in successfully");
// 			return res.status(200).json({ accessToken, email: users.email });
// 		})
// 		.catch((err) => {
// 			console.log("Error: ", err)
// 		});
// })

// listener
app.listen(port, () => {
	console.log("Server running on PORT " + port);
});
