import React from 'react';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { Slider } from '@mui/material';

const Settings = ({ user }) => {
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	const [distance, setDistance] = useState(10);
	const [age, setAge] = useState([18, 99]);

	const handleChangeDistance = (e, value) => {
		// const value = e.target.value;
		setDistance(value);
	}

	const minAgeGap = 1;

	const handleChangeAge = (e, newValue, activeThumb) => {
		if (!Array.isArray(newValue)) {
		  return;
		}
		if (activeThumb === 0) {
			setAge([Math.min(newValue[0], age[1] - minAgeGap), age[1]]);
		}
		else {
			setAge([age[0], Math.max(newValue[1], age[0] + minAgeGap)]);
		}
	}

	return (
		<>
			<div className='setting-container'>
				<form>
					<section>
						<p>DISCOVERY SETTINGS</p>
						<label htmlFor="location">Location</label>
						<input
						/>

						<div className="setting-label">
							<label htmlFor="distance">Maximum Distance</label>
							{ distance } km
						</div>

						<Slider
							value={ distance }
							onChange={ handleChangeDistance }
							valueLabelDisplay="auto"
							color="#74A12E"
						/>

						<div className="setting-label">
							<label htmlFor='age-range'>Age Range</label>
							{ age[0] } - { age[1] }
						</div>

						<Slider
							value={ age }
							onChange={ handleChangeAge }
							valueLabelDisplay="auto"
						/>

						<p>NOTIFICATIONS</p>
						<label htmlFor="email-notif">Email</label>
						<input>

						</input>

						<p>Logout</p>
					</section>
				</form>
			</div>
		</>
	)
}

export default Settings
