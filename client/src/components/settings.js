import { useCookies } from 'react-cookie';
import { Slider } from 'material-ui-slider';

const Settings = ({ user }) => {
	const [cookies, setCookie, removeCookie] = useCookies(['user']);

	return (
		<>
			<div className='setting-container'>
				<form>
					<section>
						<p>DISCOVERY SETTINGS</p>
						<label htmlFor="location">Location</label>
						<input
						/>

						<label htmlFor="distance">Maximum Distance</label>

						<input
							id="distance"
							type="range"
							name="distance"
							min="1"
							max="50"
						/>

						<label htmlFor='age-range'>Age Range</label>
						<Slider
							name="age_rage"
							defaultValue={[18, 99]}
							range
							valueLabelDisplay="auto"
						/>


						<div className="multi-range">
							{/* <input
								id="lower"
								type="range"
								name="age_range"
								min="18"
								max="100"
							/>
							<input
								id="higher"
								type="range"
								name="age_range"
								min="18"
								max="100"
							/> */}
						</div>

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
