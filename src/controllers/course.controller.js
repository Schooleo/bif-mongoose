// Course Controller
const Course = require('../models/course.model');
const mongoose = require('mongoose');

exports.getCourseStats = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      // Stage 1: Only take published courses
      { $match: { isPublished: true } },
      
      // Stage 2: Group by Category
      {
        $group: {
          _id: '$category', // Group by field category
          numCourses: { $sum: 1 }, // Count number of courses
          avgPrice: { $avg: '$price' }, // Calculate average price
          totalRevenuePotential: { $sum: '$price' } // Total potential revenue
        }
      },
      
      // Stage 3: Sort by average price descending
      { $sort: { avgPrice: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRawCourses = async (req, res) => {
  try {
    // Call directly to MongoDB driver, bypassing Mongoose Schema
    const rawData = await mongoose.connection.db
      .collection('courses')
      .find({ price: { $gte: 100 } }) // Get courses with price >= 100
      .limit(5)
      .toArray();

    res.status(200).json({
      status: 'success',
      source: 'Native MongoDB Driver',
      data: rawData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};