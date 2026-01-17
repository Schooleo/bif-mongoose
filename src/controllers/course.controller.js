// Course Controller
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');
const User = require('../models/user.model');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      isPublished,
      author,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    if (author) filter.author = author;
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (search) {
      filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const courses = await Course.find(filter)
      .populate('author', 'name email avatar')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sort);

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message,
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('author', 'name email bio avatar')
      .populate({
        path: 'enrollments',
        populate: { path: 'student', select: 'name email avatar' },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message,
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor only)
const createCourse = async (req, res) => {
  try {
    const { title, description, author, category, level, duration, price, thumbnail, tags, isPublished } = req.body;

    // Verify author exists and is an instructor
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    if (user.role !== 'instructor' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can create courses',
      });
    }

    const course = await Course.create({
      title,
      description,
      author,
      category,
      level,
      duration,
      price,
      thumbnail,
      tags,
      isPublished,
    });

    await course.populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating course',
      error: error.message,
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const { title, description, category, level, duration, price, thumbnail, tags, isPublished, rating } = req.body;

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (duration) course.duration = duration;
    if (price !== undefined) course.price = price;
    if (thumbnail) course.thumbnail = thumbnail;
    if (tags) course.tags = tags;
    if (isPublished !== undefined) course.isPublished = isPublished;
    if (rating) course.rating = rating;

    await course.save();
    await course.populate('author', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating course',
      error: error.message,
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Delete all enrollments for this course
    await Enrollment.deleteMany({ course: course._id });

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course and related enrollments deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message,
    });
  }
};

// @desc    Get course statistics
// @route   GET /api/courses/:id/stats
// @access  Public
const getCourseStats = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const enrollments = await Enrollment.find({ course: course._id });

    const stats = {
      totalEnrollments: enrollments.length,
      activeStudents: enrollments.filter((e) => e.status === 'active').length,
      completedStudents: enrollments.filter((e) => e.status === 'completed').length,
      averageProgress: enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length || 0,
      averageRating: course.rating,
      totalReviews: enrollments.filter((e) => e.review).length,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course statistics',
      error: error.message,
    });
  }
};

// @desc    Get courses by category
// @route   GET /api/courses/category/:category
// @access  Public
const getCoursesByCategory = async (req, res) => {
  try {
    const courses = await Course.find({
      category: req.params.category,
      isPublished: true,
    })
      .populate('author', 'name avatar')
      .sort('-rating -totalEnrollments');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses by category',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getCoursesByCategory,
};
