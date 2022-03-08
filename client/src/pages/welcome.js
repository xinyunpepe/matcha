// import verifyUser from '../services/authservice';
import Nav from '../components/nav';

const Welcome = (props) => {
	// if (props.match.path === "localhost:8000/confirm/:confirmCode") {
	// 	verifyUser(props.match.params.confirmCode);
	// }

	return (
		<div className='overlay'>
			<Nav minimal={ false }/>
			<div className="welcome">
				<h6 className='primary-title'>Account confirmed!</h6>
			</div>
		</div>
	)
}

export default Welcome
