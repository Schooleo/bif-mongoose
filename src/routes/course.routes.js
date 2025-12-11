// Course Routes
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

// Aggregation Route for Course Stats
router.get('/stats', courseController.getCourseStats);

// Raw Query Route for Courses
router.get('/raw-native', courseController.getRawCourses);

module.exports = router;