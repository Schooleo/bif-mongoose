// Enrollment Routes
const express = require('express');
const router = express.Router();
const {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  markEnrollmentCompleted,
} = require('../controllers/enrollment.controller');

// Base routes
router
  .route('/')
  .get(getAllEnrollments) // GET /api/enrollments
  .post(createEnrollment); // POST /api/enrollments

// Student enrollments
router.route('/student/:studentId').get(getEnrollmentsByStudent); // GET /api/enrollments/student/:studentId

// Course enrollments
router.route('/course/:courseId').get(getEnrollmentsByCourse); // GET /api/enrollments/course/:courseId

// ID-based routes
router
  .route('/:id')
  .get(getEnrollmentById) // GET /api/enrollments/:id
  .put(updateEnrollment) // PUT /api/enrollments/:id
  .delete(deleteEnrollment); // DELETE /api/enrollments/:id

// Complete enrollment
router.route('/:id/complete').put(markEnrollmentCompleted); // PUT /api/enrollments/:id/complete

module.exports = router;
