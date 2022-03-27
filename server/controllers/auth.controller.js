const userModel = require('../models/user.model');
const resetPasswordModel = require('../models/resetpassword.model');
const messageModel = require('../models/message.model');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('../config/mailer.config');

exports.signup = (req, res) => {
	const { username, email, password } = req.body;
	userModel.findOne({ username }).exec((err, users) => {
		if (users) {
			return res.status(400).json({ error: 'User exists already' });
		}
	})
	userModel.findOne({ email }).exec((err, users) => {
		if (users) {
			return res.status(400).json({ error: 'Email exists already' });
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
	});
	nodemailer.sendConfirmEmail(username, email, emailToken);
	res.send(data);
}

exports.activeUser = (req, res) => {
	userModel.findOne({ confirm_code: req.params.confirmCode })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User Not found" });
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
			});
			// cookie
			const cookieToken = jwt.sign({ email: users.email }, process.env.COOKIE_TOKEN, {
				expiresIn: 60 * 24,
			});
			res.cookie('CookieToken', cookieToken, { expire: Date.now() + 60 * 24 });
			res.cookie('UserId', users.user_id);
			res.redirect('http://localhost:3000/onboarding');
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
			return res.status(201).json({ accessToken, userId: users.user_id });
		})
		.catch((err) => {
			console.log("Error: ", err)
		});
}

exports.resetPassword = (req, res) => {
	userModel.findOne({ email: req.body.email })
		.then((users) => {
			// console.log(users);
			if (!users) {
				return res.status(404).json({ message: "User not found" });
			}
			const userId = users.user_id;
			const passwordToken = jwt.sign({ email: req.body.email }, process.env.PASSWORD_TOKEN);

			const data = new resetPasswordModel({
				user_id: userId,
				email: req.body.email,
				token: passwordToken
			});
			data.save((err) => {
				if (err) {
					res.status(500).json({ message: err });
					return;
				}
			});
			nodemailer.resetPasswordEmail(req.body.email, passwordToken);
			res.send(data);
		})
		.catch((err) => {
			console.log("Error: ", err)
		});
}

exports.verifyPassword = (req, res) => {
	resetPasswordModel.findOne({ token: req.params.passwordCode })
		.then((resetPasswords) => {
			if (!resetPasswords) {
				return res.status(404).json({ message: "Link expired already" });
			}
			const cookieToken = jwt.sign({ owner: resetPasswords.owner }, process.env.COOKIE_TOKEN, {
				expiresIn: 30,
			});
			res.cookie('CookieToken', cookieToken, { expire: Date.now() + 30 });
			res.cookie('UserId', resetPasswords.user_id);
			res.redirect('http://localhost:3000/resetpassword');
		})
		.catch((err) => {
			console.log("error", err);
		});
}

exports.updatePassword = (req, res) => {
	userModel.findOne({ user_id: req.body.userId })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}
			users.password = bcrypt.hashSync(req.body.password, 10);
			users.save((err) => {
				if (err) {
					console.log("Error in updating password");
					res.status(500).json({ message: err });
					return;
				}
				console.log('Password is updated successfully');
			});
			res.send(users);
		})
		.catch((err) => {
			console.log("error", err);
		});
}

exports.updateUser = (req, res) => {
	const formData = req.body.formData;

	userModel.findOne({ user_id: formData.user_id })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}

			var today = new Date();
			var age = today.getFullYear() - formData.birth_year;
			var m = today.getMonth() - formData.birth_month;
			if (m < 0 || (m === 0 && today.getDate() < formData.birth_day)) {
				age--;
			}

			users.age = age.parseInt();
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
			users.passions = formData.passions;
			users.matches = formData.matches;

			users.save((err) => {
				if (err) {
					console.log("Error in updating account");
					res.status(500).json({ message: err });
					return;
				}
				console.log('User is updated successfully');
			});
			res.send(users);
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

exports.getFilteredUsers = (req, res) => {
	const maxDistanceInMeters = req.query.distance * 1000;

	userModel.find({
			gender_identity: { $eq : req.query.gender },
			// geographical_area: { $eq : req.query.area },
			age: { $gte: req.query.age_from, $lte: req.query.age_to},
			location: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [req.query.lng, req.query.lat],
					},
					$maxDistance: maxDistanceInMeters,
				},
			},
		})
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User not found" });
			}
			// console.log(users);
			res.send(users);
		})
		.catch((err) => {
			console.log("error", err);
		});
}

exports.addMatch = (req, res) => {
	userModel.findOne({ user_id: req.body.userId })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}
			users.matches.push(req.body.matchedUserId);
			users.save((err) => {
				if (err) {
					console.log("Error in updating account");
					res.status(500).json({ message: err });
					return;
				}
				console.log('User is updated successfully');
			});
			res.send(users);
		})
		.catch((err) => {
			console.log("error", err);
		});
}

exports.updateSettings = (req, res) => {
	const formData = req.body.formData;

	userModel.findOne({ user_id: formData.user_id })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}

			users.location = {'type': 'Point', 'coordinates': formData.location};
			users.geographical_area = formData.geographical_area;
			users.distance = formData.distance;
			users.age_range = formData.age_range;

			users.save((err) => {
				if (err) {
					console.log("Error in updating settings");
					res.status(500).json({ message: err });
					return;
				}
				console.log('Settings are updated successfully');
			});
			res.send(users);
		})
		.catch((err) => {
			console.log("error", err);
		});
}

// WHY ASYNC IS NECCESERY???
exports.getMatchedUsers = async (req, res) => {
	// console.log(JSON.parse(req.query.userIds));

	const foundUsers = await userModel.aggregate([
		{
			'$match': {
				'user_id': {
					'$in': JSON.parse(req.query.userIds)
				}
			}
		}
	]);
	// console.log(foundUsers);
	res.send(foundUsers);
}

exports.getMessages = (req, res) => {
	messageModel.find({
			from_userId: req.query.userId,
			to_userId: req.query.matchedUserId
		})
		.then((messages) => {
			if (!messages) {
				return res.status(404).json({ message: "Message not found" });
			}
			// console.log(users);
			res.send(messages);
		})
		.catch((err) => {
			console.log("error", err);
		});
}

exports.addMessage = (req, res) => {
	const message = req.body.message;

	const data = new messageModel({
		timestamp: message.timestamp,
		from_userId: message.from_userId,
		to_userId: message.to_userId,
		message: message.message
	});

	data.save((err) => {
		if (err) {
			res.status(500).json({ message: err });
			return;
		}
	});
	res.send(data);
}

exports.updateMoreUrls = (req, res) => {
	userModel.findOne({ user_id: req.body.userId })
		.then((users) => {
			if (!users) {
				return res.status(404).json({ message: "User Not found." });
			}
			users.more_url = req.body.image;
			users.save((err) => {
				if (err) {
					console.log("Error in updating more urls");
					res.status(500).json({ message: err });
					return;
				}
				console.log('More urls are updated successfully');
			});
			res.send(users);
		})
		.catch((err) => {
			console.log("error", err);
		});
}
