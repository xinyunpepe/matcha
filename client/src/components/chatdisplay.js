import Chat from "./chat";
import ChatInput from "./chatinput";
import { useState, useEffect } from "react";
import axios from "axios";

const ChatDisplay = ({ user, clickedUser }) => {
	const [usersMessages, setUsersMessages] = useState(null);
	const [clickedUsersMessages, setClickedUsersMessages] = useState(null);
	const userId = user?.user_id;
	const clickedUserId = clickedUser?.user_id;

	const getUsersMessages = async () => {
		try {
			const response = await axios.get('http://localhost:8000/messages', {
				params: { userId: userId, matchedUserId: clickedUserId }
			})
			setUsersMessages(response.data);
		}
		catch (err) {
			console.log(err);
		}
	}

	const getClickedUsersMessages = async () => {
		try {
			const response = await axios.get('http://localhost:8000/messages', {
				params: { userId: clickedUserId, matchedUserId: userId }
			})
			setClickedUsersMessages(response.data);
		}
		catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		getUsersMessages()
		getClickedUsersMessages()
	}, [])

	// format the message we fetched
	const messages = [];

	usersMessages?.forEach(message => {
		const formattedMessage = {};
		formattedMessage['name'] = user?.first_name;
		formattedMessage['img'] = user?.url;
		formattedMessage['message'] = message?.message;
		formattedMessage['timestamp'] = message?.timestamp;
		messages.push(formattedMessage);
	});

	clickedUsersMessages?.forEach(message => {
		const formattedMessage = {};
		formattedMessage['name'] = clickedUser?.first_name;
		formattedMessage['img'] = clickedUser?.url;
		formattedMessage['message'] = message?.message;
		formattedMessage['timestamp'] = message?.timestamp;
		messages.push(formattedMessage);
	});

	const decendingOrderedMessages = messages?.sort((a, b) =>
		a.timestamp.localeCompare(b.timestamp));


	// TODO: optimize chat layout
	return (
		<>
			<Chat decendingOrderedMessages={ decendingOrderedMessages }/>
			<ChatInput
				user={ user }
				clickedUser={ clickedUser }
				getUsersMessages={ getUsersMessages }
				getClickedUsersMessages={ getClickedUsersMessages }
			/>
		</>
	)
}

export default ChatDisplay
