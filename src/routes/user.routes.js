// User Routes
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Transaction Route for Buying Course
router.post('/buy-course', userController.buyCourse);

module.exports = router;