const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('../config/mailer.config');

exports.signup = (req, res) => {
	const { username, email, password } = req.body;
	userModel.findOne({ username }).exec((err, users) => {
		if (users) {
			return res.status(400).json({ error: 'User exists already'});
		}
	})
	userModel.findOne({ email }).exec((err, users) => {
		if (users) {
			return res.status(400).json({ error: 'Email exists already'});
		}
	})

	const emailToken = jwt.sign({ email: req.body.email }, process.env.EMAIL_TOKEN);

	const data = new userModel({
		user_id: uuidv4(),
		username: username,
		email: email.toLowerCase(),
		password: bcrypt.hashSync(password, 10),
		confirm_code: emailToken
	});

	data.save((err) => {
		if (err) {
			res.status(500).json({ message: err });
			return;
		}
		nodemailer.sendConfirmEmail(
			username,
			email,
			emailToken
		);
		return res.json({ message: "Please check your email" });
	});
}

exports.activeUser = (req, res) => {
	userModel.findOne({ confirm_code: req.params.confirmCode })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}
			// console.log(users);
			users.status = "Active";
			users.save((err) => {
				if (err) {
					console.log("Error in activating account");
					res.status(500).json({ message: err });
					return;
				}
				console.log('User is signed up successfully');

				// cookie
				const cookieToken = jwt.sign({ email: users.email }, process.env.COOKIE_TOKEN, {
					expiresIn: 60 * 24,
				});
				res.cookie('CookieToken', cookieToken, { expire: Date.now() + 60 * 24 });
				res.cookie('UserId', users.user_id);
				res.redirect('http://localhost:3000/onboarding');
			});
		})
		.catch((err) => {
			console.log("error", err);
		});
}

exports.login = (req, res) => {
	userModel.findOne({ email: req.body.email })
		.then((users) => {
			// console.log(users);
			if (!users) {
				return res.status(404).json({ message: "User not found" });
			}
			const correctPassword = bcrypt.compareSync(req.body.password, users.password);
			if (!correctPassword) {
				return res.status(400).json({ message: "Invalid password" });
			}
			if (users.status != "Active") {
				return res.status(401).json({ message: "Pending Account. Please verify your Email" });
			}
			const accessToken = jwt.sign({ email: req.body.email }, process.env.ACCESS_TOKEN, {
				expiresIn: 60 * 24
			})
			console.log("User is logged in successfully");
			return res.status(201).json({ accessToken, email: users.email });
		})
		.catch((err) => {
			console.log("Error: ", err)
		});
}

exports.updateUser = (req, res) => {
	const formData = req.body.formData;

	userModel.findOne({ user_id: formData.user_id })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}

			users.first_name = formData.first_name;
			users.last_name = formData.last_name;
			users.birth_day = formData.birth_day;
			users.birth_month = formData.birth_month;
			users.birth_year = formData.birth_year;
			users.show_gender = formData.show_gender;
			users.gender_identity = formData.gender_identity;
			users.gender_interest = formData.gender_interest;
			users.url = formData.url;
			users.about = formData.about;
			users.matches = formData.matches;

			users.save((err) => {
				if (err) {
					console.log("Error in updating account");
					res.status(500).json({ message: err });
					return;
				}
				console.log('User is updated successfully');
				// get response status from the front end
				res.send(users);
			});
		})
		.catch((err) => {
			console.log("error", err);
		});
}

exports.getUser = (req, res) => {
	userModel.findOne({ user_id: req.query.userId })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User not found" });
			}
			res.send(users);
		})
		.catch((err) => {
			console.log("error", err);
		});
}
