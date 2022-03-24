import React from 'react';
import Nav from '../components/nav';
import AuthModal from '../components/authmodal';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

const Home = () => {
	// useState usage => const [state, setState] = useState(initialState);
	// setState(newState);

	// init showModal to false
	const [showModal, setShowModal] = useState(false);
	// init isSignup to true
	const [isSignup, setIsSignup] = useState(true);
	const [cookies, setCookie, removeCookie] = useCookies(['user']);

	// determine login or not
	const authToken = cookies.CookieToken;

	// button handler
	const handleClick = () => {
		if (authToken) {
			removeCookie('UserId', cookies.UserId);
			removeCookie('CookieToken', cookies.CookieToken);
			console.log("User is logged out successfully");
			window.location.reload();
			return
		}
		// once button clicked, the modal shows up
		setShowModal(true);
		setIsSignup(true);

	}

	return (
		// wrapping div for JSX
		<div className='overlay'>

			{/* minimal determines which logo to use
			authToken determines if login button shows*/}
			<Nav
				authToken={ authToken }
				minimal={ false }
				setShowModal={ setShowModal }
				showModal={ showModal }
				setIsSignup={ setIsSignup }
			/>

			<div className="home">
				<h1 className='primary-title'>Swipe Right</h1>
				<button className="primary-button" onClick={ handleClick }>
					{/* if authToken exist(signed in) => signout, else => create account */}
					{ authToken ? 'Signout' : 'Create Account' }
				</button>

				{/* show the modal if showModal is true */}
				{ showModal && (
					<AuthModal setShowModal={ setShowModal }
					isSignup={ isSignup }/>
				)}

			</div>

		</div>
	)
}

export default Home
