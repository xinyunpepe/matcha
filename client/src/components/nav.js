const Nav = ({ authToken, minimal, setShowModal, showModal, setIsSignup}) => {

	const handleClick = () => {
		setShowModal(true);
		setIsSignup(false);
	}

	return (
		<nav>
			<div className="logo-container">
				{ minimal ? <p className='text-logo-green'>🍵matcha</p>
				: <p className='text-logo-white'>🍵 matcha</p> }

				{/* <img className="logo" src={ minimal ? textLogo : emojiLogo }/> */}

			</div>
			{/* if not logged in yet(!authToken), showes log in button */}
			{ !authToken && !minimal && <button
				className='nav-button'
				// shows the modal if click login
				onClick={ handleClick }
				// disable the button once the modal shown
				disabled={ showModal }
			>Log in</button> }
		</nav>
	)
}

export default Nav
