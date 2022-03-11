import ChatHeader from "./chatheader";
import MatchesDisplay from "./matchesdisplay";
import ChatDisplay from "./chatdisplay";

const ChatContainer = ({ user }) => {
	return (
		<div className="chat-container">
			<ChatHeader user={ user }/>

			<div>
				<button className="option">Matches</button>
				<button className="option">Chat</button>
			</div>

			<MatchesDisplay/>

			<ChatDisplay/>
		</div>
	)
}

export default ChatContainer
