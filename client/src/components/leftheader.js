import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

const LeftHeader = ({ user, isSettings, setIsSettings }) => {
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	const navigate = useNavigate();

	const logout = () => {
		removeCookie('UserId', cookies.UserId);
		removeCookie('AuthToken', cookies.AuthToken);
		console.log("User is logged out successfully");
		// window.location.reload();
		navigate('/');
	}

	const handleSettings = () => {
		if (!isSettings) {
			setIsSettings(true);
		}
		else {
			setIsSettings(false);
		}
	}

	return (
		<>
			{ !isSettings &&
				<div className="chat-header">
					<div className="profile">
						<div className="img-container">
							<img
								src={ user.url }
								alt={ "photo of " + user.first_name }
								onClick={ handleSettings }
							/>
						</div>
						<h2>{ user.first_name }</h2>
					</div>
					<p className="log-out-icon" onClick={ logout }>⌦</p>
				</div>
			}
			{ isSettings &&
				<div className="setting-header">
					<p className="go-back-icon" onClick={ handleSettings }>⇦</p>
					<div className="profile-setting">
						<div className="img-container">
							<img
								src={ user.url }
								alt={ "photo of " + user.first_name }
								onClick={ handleSettings }
							/>
						</div>
						<h2>{ user.first_name }</h2>
					</div>
				</div>
			}
		</>
	)
}

export default LeftHeader
