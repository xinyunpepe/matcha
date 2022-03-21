import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@mui/material';
import axios from 'axios';

const Settings = () => {
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitute] = useState(null);
	const [address, setAddress] = useState(null);
	const [showLocation, setShowLocation] = useState(false);
	const [distance, setDistance] = useState(10);
	const [age, setAge] = useState([0, 99]);
	const [formData, setFormData] = useState({
		user_id: cookies.UserId,
		location: [],
		distance: '',
		age_range: []
	});

	useEffect(() => {
		if (!('geolocation' in navigator)) {
			console.log("Geolocation not supported");
		}
		navigator.geolocation.watchPosition((location) => {
			setLatitude(location.coords.latitude);
			setLongitute(location.coords.longitude);
		})
	}, [])

	const getLocation = () => {
		axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoieGlueXVucGVwZSIsImEiOiJjbDEwaWJhNGQwMDlpM2RvZjdvbHE5aGFnIn0.YOm_nqLR1p7yeHtxRu22EA`)
			.then(({data}) => {
				setAddress(data.features[1].place_name)
			})
			.catch(err => {
				console.log(err)
			})
		setShowLocation(true);

		const locationData = [latitude, longitude];
		setFormData((prevState) => ({
			...prevState,
			location : locationData
		}))
	}

	// console.log(address);

	const handleChangeDistance = (e, value) => {
		// const value = e.target.value;
		setDistance(value ?? '');
		setFormData((prevState) => ({
			...prevState,
			distance : value
		}))
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
		setFormData((prevState) => ({
			...prevState,
			age_range : age
		}))
	}

	const sliderStyle = {
		color: "rgb(116, 161, 46)"
	}

	let navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put('http://localhost:8000/settings', { formData });
			const success = response.status === 200;
			if (success) {
				navigate('/dashboard');
			}
		}
		catch (err) {
			console.log(err);
		}
	}

	const logout = () => {
		removeCookie('UserId', cookies.UserId);
		removeCookie('CookieToken', cookies.CookieToken);
		console.log("User is logged out successfully");
		window.location.reload();
	}

	return (
		<>
			<div className='setting-container'>
				<form onSubmit={ handleSubmit }>
					<section>
						<p>DISCOVERY SETTINGS</p>
						<div className="setting-label">
							<label htmlFor="location">Location</label>
							{/* { latitude }, { longitude } */}
							<p onClick = { getLocation }>{ showLocation ? address : 'Choose Location' }</p>
						</div>

						<div className="setting-label">
							<label htmlFor="distance">Maximum Distance</label>
							{ distance } km
						</div>

						<Slider
							value={ distance }
							onChange={ handleChangeDistance }
							valueLabelDisplay="off"
							style={ sliderStyle }
						/>

						<div className="setting-label">
							<label htmlFor='age-range'>Age Range</label>
							{ age[0] <= 18 ? 18 : age[0] } - { age[1] }
						</div>

						<Slider
							value={ age }
							onChange={ handleChangeAge }
							valueLabelDisplay="off"
							style={ sliderStyle }
						/>

						<p>NOTIFICATIONS</p>
						<label htmlFor="email-notif">Email</label>

						<input type="submit"/>
						<button onClick={ logout }>Log Out</button>
					</section>
				</form>
			</div>
		</>
	)
}

export default Settings
