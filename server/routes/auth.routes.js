const express = require('express');
const router = express.Router();

const { signup, activeUser, login, updateUser, getUser } = require('../controllers/auth.controller');

router.post('/signup', signup);
router.get('/confirm/:confirmCode', activeUser);
router.post('/login', login);
router.put('/user', updateUser);
router.get('/user', getUser);

module.exports = router;
