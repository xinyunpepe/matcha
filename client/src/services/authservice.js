import axios from "axios";

const verifyUser = (code) => {
	return axios.get('http://localhost:8000/confirm/' + code)
		.then((response) => {
			return response.data;
		});
};

export default verifyUser
