import { useState } from 'react';

const AuthModal = ({ setShowModal, isSignup }) => {
	// init the form to null
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [confirmPassword, setConfirmPassword] = useState(null);
	const [error, setError] = useState(null);

	console.log(email, password, confirmPassword);

	const handleClick = () => {
		// close the modal
		setShowModal(false);
	}

	const handleSubmit = (e) => {
		// prevent from refreshing the page
		e.preventDefault();
		try {
			if (isSignup && (password !== confirmPassword)) {
				setError("Passwords need to match");
			}
			console.log('make a post request to our database');
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
