// Course Routes
const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getCoursesByCategory,
} = require('../controllers/course.controller');

// Base routes
router
  .route('/')
  .get(getAllCourses) // GET /api/courses
  .post(createCourse); // POST /api/courses

// Category route
router.route('/category/:category').get(getCoursesByCategory); // GET /api/courses/category/:category

// ID-based routes
router
  .route('/:id')
  .get(getCourseById) // GET /api/courses/:id
  .put(updateCourse) // PUT /api/courses/:id
  .delete(deleteCourse); // DELETE /api/courses/:id

// Stats route
router.route('/:id/stats').get(getCourseStats); // GET /api/courses/:id/stats

module.exports = router;
