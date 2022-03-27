import React from 'react';
import TinderCard from "react-tinder-card";
import { useState, useEffect, useRef } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import LeftContainer from '../components/leftcontainer'
import axios from 'axios';
import green_heart from '../images/green-heart1.svg';
import pink_cancel from '../images/pink-cancel.svg';

const Dashboard = () => {
	const [user, setUser] = useState(null);
	const [filteredUsers, setFilteredUsers] = useState(null);
	const [isSettings, setIsSettings] = useState(false);
	const [unlikedUser, setUnlikedUser] = useState([]);
	const [editInfo, setEditInfo] = useState(false);
	const [image, setImage] = useState([]);
	const fileInputRef = useRef(null);
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

	const handleClick = (e) => {
		e.preventDefault();
		fileInputRef.current.click();
	}

	const handleImg = (img) => {
		let updatedImgList = [...image];
		updatedImgList.splice(image.indexOf(img), 1);
		setImage(updatedImgList);
	}

	// console.log(image);

	const handleAddMedia = (e) => {
		// console.log(e.target.files[])

		if (e.target.files) {
			const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
			// console.log("filesArray: ", filesArray);

			setImage((prevImages) => prevImages.concat(filesArray));
			Array.from(e.target.files).map(
				(file) => URL.revokeObjectURL(file) // avoid memory leak
			);
		}

		if (image.length > 3) {
			image.length = 3;
		}
	};

	let navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put('http://localhost:8000/more-url', { userId, image });
			const success = response.status === 200;
			if (success) {
				navigate('/dashboard');
			}
		}
		catch (err) {
			console.log(err);
		}
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

					{/* Edit info start page */}
					{ isSettings && !editInfo &&
						<div className="swipe-container">
							<div className="card-container">
								<div style={{ backgroundImage: 'url(' + user.url + ')' }} className='card'>
									<h1>{ user.first_name } { user.age }</h1>
									<div className='img-button'>
										<button onClick={() => setEditInfo(true)} className="primary-button">Edit Info</button>
									</div>
								</div>
							</div>
						</div>
					}

					{/* Edit info photos uploading page */}
					{ isSettings && editInfo &&
						<div className='swipe-container'>
							<div className='card'>
								<div className='preview-img'>
									<img src={ user.url } alt={ "photo of " + user.first_name }/>
									{ image.map((img) =>
										<img
											key={ img }
											src={ img }
											alt="previews"
											onClick={ handleImg }
										/>
									)}
								</div>
								<input
									ref={ fileInputRef }
									type='file'
									style={{ display: 'none' }}
									accept='image/*'
									onChange={ handleAddMedia }
								/>
								<div className='img-button'>
									<button onClick={ handleClick } className='primary-button'>add media</button>
									<button onClick={ handleSubmit } className="primary-button">Save</button>
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
