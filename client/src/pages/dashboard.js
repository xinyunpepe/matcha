import React from 'react';
import TinderCard from "react-tinder-card";
import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import LeftContainer from "../components/leftcontainer"
import axios from "axios";
import green_heart from "../images/green-heart1.svg";
import pink_cancel from "../images/pink-cancel.svg"

const Dashboard = () => {
	const [user, setUser] = useState(null);
	const [filteredUsers, setFilteredUsers] = useState(null);
	const [isSettings, setIsSettings] = useState(false);
	const [unlikedUser, setUnlikedUser] = useState([]);
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

	const getFilteredUsers = async () => {
		try {
			const response = await axios.get('http://localhost:8000/filtered-users', {
				params: {
					gender: user?.gender_interest,
					area: user?.geographical_area,
					age_from: user?.age_range[0],
					age_to: user?.age_range[1],
					distance: user?.distance,
					lng: user?.location.coordinates[0],
					lat: user?.location.coordinates[1]
				}
			})
			setFilteredUsers(response.data);
		}
		catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		getUser();
	}, []);

	useEffect(() => {
		if (user) {
			getFilteredUsers();
		}
	}, [user]);

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
		let unlikedUserList = [...unlikedUser];

		if (direction === 'right') {
			updateMatches(swipedUserId);
		}
		else if (direction === 'left') {
			unlikedUserList = [...unlikedUser, swipedUserId];
			setUnlikedUser(unlikedUserList);
		}
	}
	
	const outOfFrame = (name) => {
		console.log(name + ' left the screen!');
	}

	// map matched users ids
	const matchedUserIds = user?.matches.map((user_id) => user_id);

	// filter out already matched and unliked users
	const displayFilteredUsers = filteredUsers?.filter(
		filteredUser => !matchedUserIds.includes(filteredUser.user_id)
			&& !unlikedUser.includes(filteredUser.user_id));

	return (
		<>
			{user &&
				<div className="dashboard">
					<LeftContainer user={ user } isSettings={ isSettings } setIsSettings={ setIsSettings }/>

					{ !isSettings &&
						<div className="swipe-container">
							<div className="card-container">
								{ displayFilteredUsers?.map((filteredUser) =>
									<TinderCard
										className='swipe'
										key={ filteredUser.user_id }
										onSwipe={(dir) => swiped(dir, filteredUser.user_id)}
										onCardLeftScreen={() => outOfFrame(filteredUser.first_name)}>
										<div style={{ backgroundImage: 'url(' + filteredUser.url + ')' }} className='card'>
											<h1>{ filteredUser.first_name } { filteredUser.age }</h1>
											<table>
												<tbody>
													<tr>
													{ filteredUser.passions.map((passion, index) => (
														<td key={ index }>
															{ passion }
														</td>
													))}
													</tr>
												</tbody>
											</table>
										</div>
										<div className='swipe-buttons'>
											<button onClick={() => swiped('left', filteredUser.user_id)}>
												<img src={ pink_cancel } alt="cancel"/>
											</button>
											<button onClick={() => swiped('right', filteredUser.user_id)}>
												<img src={ green_heart } alt="like"/>
											</button>
										</div>
									</TinderCard>

								)}
							</div>
						</div>
					}
					{ isSettings &&
						<div className="swipe-container">
							<div className="card-container">
								<div className='swipe'>
									<div style={{ backgroundImage: 'url(' + user.url + ')' }} className='card'>
										<h1>{ user.first_name } { user.age }</h1>
										<button className="primary-button">Edit Info</button>
									</div>
								</div>
							</div>
						</div>
					}
				</div>
			}
		</>
	)
}

export default Dashboard
