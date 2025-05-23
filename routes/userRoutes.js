const express = require('express');
const { registerUser, loginUser ,getAllUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/all', getAllUsers);


module.exports = router;
