const express = require('express');
const router = express.Router();

const {
	signup,
	activeUser,
	login,
	updateUser,
	getUser,
	resetPassword,
	verifyPassword,
	updatePassword,
	getGenderdUsers,
	addMatch }
	= require('../controllers/auth.controller');

router.post('/signup', signup);
router.get('/confirm/:confirmCode', activeUser);
router.post('/login', login);
router.put('/resetpassword', resetPassword);
router.get('/resetpassword/:passwordCode', verifyPassword);
router.put('/updatepassword', updatePassword);
router.put('/user', updateUser);
router.get('/user', getUser);
router.get('/gendered-users', getGenderdUsers);
router.put('/addmatch', addMatch);

module.exports = router;
