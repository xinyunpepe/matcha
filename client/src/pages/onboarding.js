import React from 'react';
import Nav from "../components/nav";
import { passionsList } from "../utils/passionslist";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Onboarding = () => {
	const [cookies, setCookie, removeCookie] = useCookies(['user']);
	// init values in the form
	const [formData, setFormData] = useState({
		user_id: cookies.UserId,
		first_name: '',
		last_name: '',
		birth_day: '',
		birth_month: '',
		birth_year: '',
		show_gender: false,
		gender_identity: 'man',
		gender_interest: 'woman',
		url: '',
		about: '',
		passions: [],
		matches: []
	})

	const [checked, setChecked] = useState([]);

	let navigate = useNavigate();

	const handleCheckbox = (e) => {
		// console.log(e.target.value);
		let updatedList = [...checked];
		if (e.target.checked) {
			updatedList = [...checked, e.target.value];
		}
		else {
			// console.log('Unchecked box');
			updatedList.splice(checked.indexOf(e.target.value), 1);
		}
		setChecked(updatedList);
		setFormData((prevState) => ({
			// get the previous value(initial value)
			...prevState,
			// search for the name and change the value matching the name
			passions : updatedList
		}))
	}

	const checkedPassions = checked.length
	? checked.reduce((total, item) => {
		return total + ", " + item;
	})
	: "";

	const handleChange = (e) => {
		const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		// const value = e.target.value;
		const name = e.target.name;

		// set value of the form each time form 'changes'
		setFormData((prevState) => ({
			// get the previous value(initial value)
			...prevState,
			// search for the name and change the value matching the name
			[name] : value
		}))
	}

	console.log(formData);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put('http://localhost:8000/user', { formData });
			const success = response.status === 200;
			if (success) {
				navigate('/dashboard');
			}
		}
		catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<Nav minimal={ true }
				setShowModal={() => { }}
				showModal={ false }
			/>
			<div className="onboarding">
				<h2>CREATE ACCOUNT</h2>

				<form onSubmit={ handleSubmit }>
					<section>
						<label htmlFor="first_name">First Name</label>
						<input
							id="first_name"
							type="text"
							name="first_name"
							placeholder="First Name"
							required={ true }
							value={ formData.first_name }
							onChange={ handleChange }
						/>
						<label htmlFor="last_name">Last Name</label>
						<input
							id="last_name"
							type="text"
							name="last_name"
							placeholder="Last Name"
							required={ true }
							value={ formData.last_name }
							onChange={ handleChange }
						/>

						<label>Birthday</label>
						<div className="mul-input-container">
							<input
								id="birth_day"
								type="number"
								name="birth_day"
								placeholder="DD"
								required={ true }
								value={ formData.birth_day }
								onChange={ handleChange }
							/>
							<input
								id="birth_month"
								type="number"
								name="birth_month"
								placeholder="MM"
								required={ true }
								value={ formData.birth_month }
								onChange={ handleChange }
							/>
							<input
								id="birth_year"
								type="number"
								name="birth_year"
								placeholder="YYYY"
								required={ true }
								value={ formData.birth_year }
								onChange={ handleChange }
							/>
						</div>

						<label>Gender</label>
						<div className="mul-input-container">
							<input
								id="man-id"
								type="radio"
								name="gender_identity"
								value="man"
								onChange={ handleChange }
								checked={ formData.gender_identity === 'man' }
							/>
							<label htmlFor="man-id">Man</label>
							<input
								id="women-id"
								type="radio"
								name="gender_identity"
								value="woman"
								onChange={ handleChange }
								checked={ formData.gender_identity === 'woman' }
							/>
							<label htmlFor="women-id">Woman</label>
							<input
								id="more-gender-id"
								type="radio"
								name="gender_identity"
								value="more"
								onChange={ handleChange }
								checked={ formData.gender_identity === 'more' }
							/>
							<label htmlFor="more-gender-id">More</label>
						</div>

						<label htmlFor="show-gender">Show gender on my profile</label>
						<input
							id="show-gender"
							type="checkbox"
							name="show_gender"
							onChange={ handleChange }
							checked={ formData.show_gender }
						/>

						<label>Show Me</label>
						<div className="mul-input-container">
							<input
								id="man-interest"
								type="radio"
								name="gender_interest"
								value="man"
								onChange={ handleChange }
								checked={ formData.gender_interest === 'man' }
							/>
							<label htmlFor="man-interest">Man</label>
							<input
								id="women-interest"
								type="radio"
								name="gender_interest"
								value="woman"
								onChange={ handleChange }
								checked={ formData.gender_interest === 'woman' }
							/>
							<label htmlFor="women-interest">Woman</label>
							<input
								id="everyone-interest"
								type="radio"
								name="gender_interest"
								value="everyone"
								onChange={ handleChange }
								checked={ formData.gender_interest === 'everyone' }
							/>
							<label htmlFor="everyone-interest">Everyone</label>
						</div>

						<label htmlFor="passions">My Passions</label>
						<input readOnly
							type="text"
							placeholder="Sport, Art..."
							value={ checkedPassions }
						/>
						<div className="mul-input-container">
						{ passionsList?.map((item, index) => {
							return (
								<>
									<input
										key={ index }
										type="checkbox"
										name="passions"
										value={ item }
										onChange={ handleCheckbox }
									/>
									<label htmlFor={ item }>{ item }</label>
								</>
							)
						})}
						</div>

						<input type="submit"/>
					</section>

					<section>
						<label htmlFor="about">About Me</label>
						<input
							id="about"
							type="text"
							name="about"
							required={ true }
							placeholder="I like matcha icecream.."
							value={ formData.about }
							onChange={ handleChange }
						/>
						<label htmlFor="url">Profile Photo</label>
							<input
								id="url"
								type="url"
								name="url"
								required={true}
								onChange={handleChange}
							/>
						<div className="photo-container">
							{ formData.url && <img src={ formData.url } alt="profile photo preview"/> }
						</div>
					</section>
				</form>
			</div>
		</>
	)
}

export default Onboarding
