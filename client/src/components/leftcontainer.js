import { useState } from 'react';
import LeftHeader from "./leftheader";
import MatchesDisplay from "./matchesdisplay";
import ChatDisplay from "./chatdisplay";
import Settings from './settings';

const LeftContainer = ({ user, isSettings, setIsSettings }) => {
	// const [isSettings, setIsSettings] = useState(false);
	const [clickedUser, setClickedUser] = useState(null);

	return (
		<>
			<div className="left-container">
				<LeftHeader user={ user } isSettings={ isSettings } setIsSettings={ setIsSettings }/>

				{ !isSettings &&
					<div>
						<button className="option" onClick={() => setClickedUser(null) }>Matches</button>
						<button className="option" disabled={ !clickedUser }>Chat</button>
					</div>
				}
				{ !isSettings && !clickedUser && <MatchesDisplay matches={ user.matches } setClickedUser={ setClickedUser } /> }
				{ !isSettings && clickedUser && <ChatDisplay user={ user } clickedUser={ clickedUser } /> }

				{ isSettings && <Settings user={ user } clickedUser={ clickedUser } /> }

			</div>
		</>
	)
}

export default LeftContainer
