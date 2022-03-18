import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import LeftContainer from "../components/leftcontainer"
import axios from "axios";

const Dashboard = () => {
	const [user, setUser] = useState(null);
	const [genderedUsers, setGenderedUsers] = useState(null);
	const [lastDirection, setLastDirection] = useState();
	const [cookies, setCookie, removeCookie] = useCookies(['user']);

	const userId = cookies.UserId;

	const getUser = async () => {
		try {
			const response = await axios.get('http://localhost:8000/user', {
				params: { userId }
			})
			setUser(response.data);
		}
		catch (err) {
			console.log(err);
		}
	}

	const getGenderdUsers = async () => {
		try {
			const response = await axios.get('http://localhost:8000/gendered-users', {
				params: { gender: user?.gender_interest }
			})
			setGenderedUsers(response.data);
		}

		catch (err) {
			console.log(err);
		}
	}

	// !!!!!!INFINITE LOOP!!!!!!
	useEffect(() => {
		getUser()
		getGenderdUsers()
	}, []);

	console.log('user', user);
	console.log('gendered users', genderedUsers);

	const updateMatches = async (matchedUserId) => {
		try {
			await axios.put('http://localhost:8000/addmatch', {
				userId,
				matchedUserId
			})
			getUser();
		}
		catch (err) {
			console.log(err);
		}
	}

	const swiped = (direction, swipedUserId) => {
		if (direction === 'right') {
			updateMatches(swipedUserId);
		}
		setLastDirection(direction);
	}

	const outOfFrame = (name) => {
		console.log(name + ' left the screen!');
	}

	// map matched users ids
	const matchedUserIds = user?.matches.map((user_id) => user_id);

	// filter out already matched users
	const filteredGenderedUsers = genderedUsers?.filter(
		genderedUser => !matchedUserIds.includes(genderedUser.user_id)
	)

	return (
		<>
		{user &&
			<div className="dashboard">
				<LeftContainer user={ user }/>
				<div className="swipe-container">
					<div className="card-container">
						{ filteredGenderedUsers?.map((genderedUser) =>
							<TinderCard
								className='swipe'
								key={ genderedUser.first_name }
								onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
								onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
								<div style={{ backgroundImage: 'url(' + genderedUser.url + ')' }} className='card'>
									<h3>{ genderedUser.first_name } { genderedUser.age }</h3>
								</div>
							</TinderCard>
						)}
						<div className="swipe-info">
							{ lastDirection ? <p>You swiped {lastDirection}</p> : <p/> }
						</div>
					</div>
				</div>
			</div>
		}
		</>
	)
}

export default Dashboard
