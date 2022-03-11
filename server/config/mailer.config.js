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

