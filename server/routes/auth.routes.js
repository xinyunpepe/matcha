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
	updatePassword }
	= require('../controllers/auth.controller');

router.post('/signup', signup);
router.get('/confirm/:confirmCode', activeUser);
router.post('/login', login);
router.put('/resetpassword', resetPassword);
router.get('/resetpassword/:passwordCode', verifyPassword);
router.put('/updatepassword', updatePassword);
router.put('/user', updateUser);
router.get('/user', getUser);

module.exports = router;
