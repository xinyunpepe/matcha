import { useState } from 'react';
import validator from 'validator';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ setShowModal, isSignup }) => {
	// init the form to null
	const [username, setUsername] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [confirmPassword, setConfirmPassword] = useState(null);
	const [error, setError] = useState(null);

	// init navigate
	let navigate = useNavigate();

	// console.log(username, email, password, confirmPassword);

	const handleClick = () => {
		// close the modal
		setShowModal(false);
	}

	const handleSubmit = async (e) => {
		// prevent from refreshing the page
		e.preventDefault();
		try {
			// check if username if valid
			if (isSignup && !validator.isAlphanumeric(username)) {
				setError("Incorrect username, only letters and numbers are allowed");
				return ;
			}
			// check if email is valid
			if (isSignup && !validator.isEmail(email)) {
				setError("Incorrect email address");
				return ;
			}
			// check if password is valid
			if (isSignup && !validator.isStrongPassword(password)) {
				setError("Password minimum length 8, needs to contain at least one lowercase, one uppercase letter, one number and one symbol");
				return ;
			}
			// check if passwords match
			if (isSignup && (password !== confirmPassword)) {
				setError("Passwords don't match");
				return ;
			}
			// post data to the backend
			await axios.post('http://localhost:8000/signup', { username, email, password });

			// redirect to onboarding page if success
			// const success = response.status === 200;
			// console.log(success);

			const response = await axios.get('http://localhost:8000/confirm/');
			const success = response.status === 200;

			if (success) {
				navigate ('/onboarding');
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="auth-modal">
			<div className="close-icon" onClick={ handleClick }>⨂</div>
			<h2>{ isSignup ? 'CREATE ACCOUNT' : 'LOG IN' }</h2>
			<p>By clicking Log In, you agree to our terms. Learn how we process your data in our Privacy Policy and Cookie Policy.</p>
			<form onSubmit={ handleSubmit }>
				<input
					type="text"
					id="username"
					name="username"
					placeholder="username"
					required={ true }
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="email"
					id="email"
					name="email"
					placeholder="email"
					required={ true }
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="password"
					required={ true }
					onChange={(e) => setPassword(e.target.value)}
				/>
				{/* only showes confirmPassword in case of sign up */}
				{isSignup && <input
					type="password"
					id="password-check"
					name="password-check"
					placeholder="confirm password"
					required={ true }
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>}
				<input className='secondary-button' type="submit"/>
				<p>{ error }</p>
			</form>
			<h2>GET THE APP</h2>
		</div>
	)
}

export default AuthModal
