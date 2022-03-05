import TinderCard from "react-tinder-card";
import { useState } from "react";
import ChatContainer from "../components/chatcontainer"

const Dashboard = () => {
	const characters = [
		{
			name: 'Simon Leviev0',
			url: 'https://www.thesun.co.uk/wp-content/uploads/2022/02/NINTCHDBPICT000709124072-2.jpg?w=2480'
		},
		{
			name: 'Simon Leviev1',
			url: 'https://www.thesun.co.uk/wp-content/uploads/2022/02/NINTCHDBPICT000709124072-2.jpg?w=2480'
		},
		{
			name: 'Simon Leviev2',
			url: 'https://www.thesun.co.uk/wp-content/uploads/2022/02/NINTCHDBPICT000709124072-2.jpg?w=2480'
		},
		{
			name: 'Simon Leviev3',
			url: 'https://www.thesun.co.uk/wp-content/uploads/2022/02/NINTCHDBPICT000709124072-2.jpg?w=2480'
		},
		{
			name: 'Simon Leviev4',
			url: 'https://www.thesun.co.uk/wp-content/uploads/2022/02/NINTCHDBPICT000709124072-2.jpg?w=2480'
		}
	]

	const [lastDirection, setLastDirection] = useState();

	const swiped = (direction, nameToDelete) => {
		console.log('removing: ' + nameToDelete);
		setLastDirection(direction);
	}

	const outOfFrame = (name) => {
		console.log(name + ' left the screen!');
	}

	return (
		<div className="dashboard">
			<ChatContainer/>
			<div className="swipe-container">
				<div className="card-container">
					{ characters.map((character) =>
						<TinderCard
							className='swipe'
							key={ character.name }
							onSwipe={(dir) => swiped(dir, character.name)}
							onCardLeftScreen={() => outOfFrame(character.name)}>
							<div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
								<h3>{character.name}</h3>
							</div>
						</TinderCard>
					)}
					<div className="swipe-info">
						{ lastDirection ? <p>You swiped {lastDirection}</p> : <p/> }
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
