import { useState } from 'react';
import validator from 'validator';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const AuthModal = ({ setShowModal, isSignup }) => {
	// init the form to null
	const [username, setUsername] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [confirmPassword, setConfirmPassword] = useState(null);
	const [error, setError] = useState(null);
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	const [resetPassword, setResetPassword] = useState(null);

	// init navigate
	let navigate = useNavigate();

	// console.log(username, email, password, confirmPassword);

	const handleClick = () => {
		// close the modal
		setShowModal(false);
	}

	const handleClickPassword = () => {
		// open forgot password modal
		setResetPassword(true);
	}

	const handleSubmit = async (e) => {
		// prevent from refreshing the page
		e.preventDefault();
		try {
			if (isSignup) {
				if (!validator.isAlphanumeric(username)) {
					setError("Incorrect username, only letters and numbers are allowed");
					return ;
				}
				else if (!validator.isEmail(email)) {
					setError("Incorrect email address");
					return ;
				}
				else if (!validator.isStrongPassword(password)) {
					setError("Password minimum length 8, needs to contain at least one lowercase, one uppercase letter, one number and one symbol");
					return ;
				}
				else if (password !== confirmPassword) {
					setError("Passwords don't match");
					return ;
				}
				setError("Please check your email and active your account");
				// post data to the backend
				await axios.post('http://localhost:8000/signup', { username, email, password });
			}
			else {
				const response = await axios.post('http://localhost:8000/login', { email, password });
				// if (response.status === 400) {
				// 	setError("Invalid password");
				// 	return ;
				// }
				// else if (response.status === 401) {
				// 	setError("Pending Account. Please verify your Email");
				// 	return ;
				// }
				// else if (response.status === 404) {
				// 	setError("User not found");
				// 	return ;
				// }
				// else if (response.status === 201) {
				// 	navigate('/dashboard');
				// }
				setCookie('UserId', response.data.userId);
				setCookie('CookieToken', response.data.accessToken);

				const success = response.status === 201;
				if (success) {
					navigate('/dashboard');
				}

				window.location.reload();
			}
		}
		catch (err) {
			console.log(err);
		}
	}

	const handleSubmitEmail = async (e) => {
		e.preventDefault();
		try {
			if (!validator.isEmail(email)) {
				setError("Incorrect email address");
				return ;
			}
			setError("Please check your email and reset your password");
			await axios.put('http://localhost:8000/resetpassword', { email });
		}
		catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			{ !resetPassword &&
			<div className="auth-modal">
				<div className="close-icon" onClick={ handleClick }>⨂</div>
				<h2>{ isSignup ? 'CREATE ACCOUNT' : 'LOG IN' }</h2>
				<p>By clicking Log In, you agree to our terms. Learn how we process your data in our Privacy Policy and Cookie Policy.</p>
				<form onSubmit={ handleSubmit }>
					{/* only showes username in case of sign up */}
					{ isSignup && <input
						type="text"
						id="username"
						name="username"
						placeholder="username"
						rules={[
							{
								required: true,
								message: "USERNAME!"
							}
						]}
						onChange={(e) => setUsername(e.target.value)}
					/> }
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
					{ isSignup && <input
						type="password"
						id="password-check"
						name="password-check"
						placeholder="confirm password"
						required={ true }
						onChange={(e) => setConfirmPassword(e.target.value)}
					/> }
					<input className='secondary-button' type="submit"/>
					{ !isSignup && <a onClick={ handleClickPassword }>Trouble Logging In?</a> }
					<p>{ error }</p>
				</form>
				<h2>GET THE APP</h2>
			</div>
			}
			{ resetPassword &&
			<div className="auth-modal" style={{ height: "400px", top: "150px" }}>
				<div className="close-icon" onClick={ handleClick }>⨂</div>
				<h1>🍵</h1>
				<h2>Account Recovery</h2>
				<p>We will email you a link that will instantly log you in</p>
				<form onSubmit={ handleSubmitEmail }>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="Email Address"
						required={ true }
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input className='secondary-button' type="submit" value="SEND EMAIL"/>
					<p>{ error }</p>
				</form>
			</div>
			}
		</>
	)
}

export default AuthModal
