import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const MatchesDisplay = ({ matches, setClickedUser }) => {
	const [matchedProfiles, setMatchesProfiles] = useState(null);
	const [cookies, setCookie, removeCookie] = useCookies(null);

	const matchedUserIds = matches.map((user_id) => user_id);
	const userId = cookies.UserId;

	const getMatches = async () => {
		try {
			const response = await axios.get('http://localhost:8000/matched-users', {
				params: { userIds: JSON.stringify(matchedUserIds) }
			})
			setMatchesProfiles(response.data);
		}
		catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		getMatches()
	}, [matches])

	// console.log(matchedProfiles);

	const filteredMatchedProfiles = matchedProfiles?.filter(
		(matchedProfile) => matchedProfile.matches.filter((profile) =>
			profile.user_id == userId).length > 0
	)

	return (
		<>
			<div className="matches-display">
				{ filteredMatchedProfiles?.map((match) => (
					<div key={ match.user_id } className="match-card" onClick={() => setClickedUser(match) }>
						<div className='img-container'>
							<img src={ match?.url } alt={ match?.first_name + ' profile' }/>
						</div>
						<h3>{ match?.first_name }</h3>
					</div>
				))}
			</div>
		</>
	)
}

export default MatchesDisplay
