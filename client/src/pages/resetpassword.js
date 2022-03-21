import React from 'react';
import Nav from "../components/nav";
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import axios from "axios";

const Resetpassword = () => {
	const [password, setPassword] = useState(null);
	const [confirmPassword, setConfirmPassword] = useState(null);
	const [error, setError] = useState(null);
	const [cookies, setCookie, removeCookie] = useCookies(['user']);

	const userId = cookies.UserId;

	let navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!validator.isStrongPassword(password)) {
				setError("Password minimum length 8, needs to contain at least one lowercase, one uppercase letter, one number and one symbol");
				return ;
			}
			else if (password !== confirmPassword) {
				setError("Passwords don't match");
				return ;
			}
			const response = await axios.put('http://localhost:8000/updatepassword', { userId, password });
			const success = response.status === 200;
			if (success) {
				removeCookie('UserId', cookies.UserId);
				removeCookie('CookieToken', cookies.CookieToken);
				navigate('/');
			}

			window.location.reload();
		}
		catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<Nav minimal={ true }
				setShowModal={() => { }}
				showModal={ false }
			/>
			<div className="onboarding">
				<h2>RESET PASSWORD</h2>
				<form onSubmit={ handleSubmit }>
					<section>
						<label htmlFor="password">New Password</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="password"
							required={ true }
							onChange={(e) => setPassword(e.target.value)}
						/>
						<label htmlFor="password-check">Confirm New Password</label>
						<input
							type="password"
							id="password-check"
							name="password-check"
							placeholder="confirm password"
							required={ true }
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<input type="submit"/>
					</section>
					<p>{ error }</p>
				</form>
			</div>
		</>
	)
}

export default Resetpassword
