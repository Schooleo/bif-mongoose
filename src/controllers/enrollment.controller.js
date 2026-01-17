// Enrollment Controller
const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Public
const getAllEnrollments = async (req, res) => {
  try {
    const { student, course, status, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (student) filter.student = student;
    if (course) filter.course = course;
    if (status) filter.status = status;

    // Pagination
    const skip = (page - 1) * limit;

    const enrollments = await Enrollment.find(filter)
      .populate('student', 'name email avatar')
      .populate('course', 'title category price thumbnail')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ enrolledAt: -1 });

    const total = await Enrollment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: enrollments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message,
    });
  }
};

// @desc    Get single enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Public
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'name email avatar bio')
      .populate('course', 'title description category level duration price author');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment',
      error: error.message,
    });
  }
};

// @desc    Create new enrollment
// @route   POST /api/enrollments
// @access  Private
const createEnrollment = async (req, res) => {
  try {
    const { student, course, paymentStatus, paymentAmount } = req.body;

    // Verify student exists
    const studentUser = await User.findById(student);
    if (!studentUser) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Verify course exists
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({ student, course });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course',
      });
    }

    const enrollment = await Enrollment.create({
      student,
      course,
      paymentStatus: paymentStatus || (courseDoc.price === 0 ? 'free' : 'pending'),
      paymentAmount: paymentAmount || courseDoc.price,
    });

    // Update course total enrollments
    courseDoc.totalEnrollments += 1;
    await courseDoc.save();

    await enrollment.populate([
      { path: 'student', select: 'name email avatar' },
      { path: 'course', select: 'title category price' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating enrollment',
      error: error.message,
    });
  }
};

// @desc    Update enrollment
// @route   PUT /api/enrollments/:id
// @access  Private
const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    const { status, progress, rating, review, paymentStatus } = req.body;

    // Update fields
    if (status) enrollment.status = status;
    if (progress !== undefined) enrollment.progress = progress;
    if (rating) enrollment.rating = rating;
    if (review) enrollment.review = review;
    if (paymentStatus) enrollment.paymentStatus = paymentStatus;

    // Auto-complete if progress is 100%
    if (progress === 100 && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    await enrollment.populate([
      { path: 'student', select: 'name email avatar' },
      { path: 'course', select: 'title category price' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating enrollment',
      error: error.message,
    });
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private
const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Update course total enrollments
    const course = await Course.findById(enrollment.course);
    if (course && course.totalEnrollments > 0) {
      course.totalEnrollments -= 1;
      await course.save();
    }

    await enrollment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting enrollment',
      error: error.message,
    });
  }
};

// @desc    Get enrollments by student
// @route   GET /api/enrollments/student/:studentId
// @access  Public
const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { student: req.params.studentId };

    if (status) filter.status = status;

    const enrollments = await Enrollment.find(filter)
      .populate('course', 'title description category level duration price thumbnail author')
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student enrollments',
      error: error.message,
    });
  }
};

// @desc    Get enrollments by course
// @route   GET /api/enrollments/course/:courseId
// @access  Public
const getEnrollmentsByCourse = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { course: req.params.courseId };

    if (status) filter.status = status;

    const enrollments = await Enrollment.find(filter).populate('student', 'name email avatar').sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course enrollments',
      error: error.message,
    });
  }
};

// @desc    Mark enrollment as completed
// @route   PUT /api/enrollments/:id/complete
// @access  Private
const markEnrollmentCompleted = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    await enrollment.markCompleted();
    await enrollment.populate([
      { path: 'student', select: 'name email avatar' },
      { path: 'course', select: 'title category price' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Enrollment marked as completed',
      data: enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error completing enrollment',
      error: error.message,
    });
  }
};

module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  markEnrollmentCompleted,
};
