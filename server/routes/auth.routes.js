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
	getFilteredUsers,
	addMatch,
	updateSettings,
	getMatchedUsers,
	getMessages,
	addMessage
} = require('../controllers/auth.controller');

router.post('/signup', signup);
router.get('/confirm/:confirmCode', activeUser);
router.post('/login', login);
router.put('/resetpassword', resetPassword);
router.get('/resetpassword/:passwordCode', verifyPassword);
router.put('/updatepassword', updatePassword);
router.put('/user', updateUser);
router.get('/user', getUser);
router.get('/filtered-users', getFilteredUsers);
router.put('/addmatch', addMatch);
router.put('/settings', updateSettings);
router.get('/matched-users', getMatchedUsers);
router.get('/messages', getMessages);
router.post('/message', addMessage);

module.exports = router;
