import React from 'react';
import { useState } from 'react';
import LeftHeader from "./leftheader";
import MatchesDisplay from "./matchesdisplay";
import ChatDisplay from "./chatdisplay";
import Settings from './settings';

const LeftContainer = ({ user }) => {
	const [isSettings, setIsSettings] = useState(false);

	return (
		<>
			<div className="left-container">
				<LeftHeader user={ user } isSettings={ isSettings } setIsSettings={ setIsSettings } />
				{ !isSettings &&
					<div>
						<button className="option">Matches</button>
						<button className="option">Chat</button>
					</div>
				}
				{ !isSettings && <MatchesDisplay/> }
				{ !isSettings && <ChatDisplay/> }

				{ isSettings && <Settings user={ user }/> }

			</div>
		</>
	)
}

export default LeftContainer
