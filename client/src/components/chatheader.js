import { useCookies } from 'react-cookie';

const ChatHeader = ({ user }) => {
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	const logout = () => {
		removeCookie('UserId', cookies.UserId);
		removeCookie('CookieToken', cookies.CookieToken);
		console.log("User is logged out successfully");
		window.location.reload();
	}

	return (
		<div className="chat-header">
			<div className="profile">
				<div className="img-container">
					<img src={ user.url } alt={ "photo of " + user.first_name }/>
				</div>
				<h3>{ user.first_name }</h3>
			</div>
			<i className="log-out-icon" onClick={ logout }>logout</i>
		</div>
	)
}

export default ChatHeader
