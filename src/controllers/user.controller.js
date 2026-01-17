// User Controller
const User = require('../models/user.model');
const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Pagination
    const skip = (page - 1) * limit;

    const users = await User.find(filter).select('-password').limit(parseInt(limit)).skip(skip).sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('coursesCreated', 'title category price')
      .populate({
        path: 'enrollments',
        populate: { path: 'course', select: 'title category' },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, bio, avatar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      bio,
      avatar,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
};

// @desc    Update user (using findByIdAndUpdate)
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const { name, email, bio, avatar, role, isActive } = req.body;

    // Check if user exists first
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    // Build update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    // findByIdAndUpdate: query-based, không chạy document middleware pre('save')
    // new: true => trả về document sau khi update
    // runValidators: true => chạy schema validation
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

// @desc    Update user (using updateOne - alternative approach)
// @route   PUT /api/users/:id/alt
// @access  Private
const updateUserWithUpdateOne = async (req, res) => {
  try {
    const { name, email, bio, avatar, role, isActive } = req.body;

    // Check if user exists
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    // updateOne: chỉ update, không trả về document
    // Cần query lại để lấy data
    const result = await User.updateOne({ _id: req.params.id }, { $set: updateData }, { runValidators: true });

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'No changes made to user',
      });
    }

    // Fetch updated user
    const user = await User.findById(req.params.id).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete related enrollments
    await Enrollment.deleteMany({ student: user._id });

    // Delete courses created by user if instructor
    if (user.role === 'instructor') {
      const courses = await Course.find({ author: user._id });
      for (const course of courses) {
        await Enrollment.deleteMany({ course: course._id });
      }
      await Course.deleteMany({ author: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and related data deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Public
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let stats = {};

    if (user.role === 'student') {
      const enrollments = await Enrollment.find({ student: user._id });
      stats = {
        totalEnrollments: enrollments.length,
        completedCourses: enrollments.filter((e) => e.status === 'completed').length,
        activeCourses: enrollments.filter((e) => e.status === 'active').length,
        averageProgress: enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length || 0,
      };
    } else if (user.role === 'instructor') {
      const courses = await Course.find({ author: user._id });
      const totalEnrollments = await Enrollment.countDocuments({
        course: { $in: courses.map((c) => c._id) },
      });
      stats = {
        totalCourses: courses.length,
        publishedCourses: courses.filter((c) => c.isPublished).length,
        totalStudents: totalEnrollments,
        averageRating: courses.reduce((acc, c) => acc + parseFloat(c.rating), 0) / courses.length || 0,
      };
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserWithUpdateOne,
  deleteUser,
  getUserStats,
};
