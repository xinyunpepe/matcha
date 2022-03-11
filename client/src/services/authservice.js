import axios from "axios";

const signUp = (username, email, password) => {
	return axios.post('http://localhost:8000/signup', { username, email, password });
};

const activeUser = (code) => {
	return axios.get('http://localhost:8000/confirm/' + code)
		.then((response) => {
			console.log(response.data);
			return response.data;
		});
};

export default { signUp, activeUser };
