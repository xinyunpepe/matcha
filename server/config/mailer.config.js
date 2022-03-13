const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
	service: "Gmail",
	secure: false,
	port: 25,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASS
	},
});

module.exports.sendConfirmEmail = (username, email, emailToken) => {
	transport.sendMail({
		from: process.env.EMAIL,
		to: email,
		subject: "Please confirm your registration",
		html: `<h1>Email Confirmation</h1>
		<h2>Hello ${ username }</h2>
		<p>Thank you for signing up matcha. Please confirm your email by clicking on the following link</p>
		<a href=http://localhost:8000/confirm/${ emailToken }> Click here</a>
		</div>`,
	})
	.then(() => {
		console.log('Confirmation email sent successfully');
	})
	.catch(err => {
		console.log("Error: ", err);
	})
}

module.exports.resetPasswordEmail = (email, passwordToken) => {
	transport.sendMail({
		from: process.env.EMAIL,
		to: email,
		subject: "Please reset your password",
		html: `<h1>Reset Password</h1>
		<h2>Hello</h2>
		<p>Please reset your password by clicking on the following link</p>
		<a href=http://localhost:8000/resetpassword/${ passwordToken }> Click here</a>
		<p>Link is valid for 30 minutes</p>
		</div>`,
	})
	.then(() => {
		console.log('Reset password email sent successfully');
	})
	.catch(err => {
		console.log("Error: ", err);
	})
}

