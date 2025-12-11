const Course = require("../models/course.model");

const getCourseDetails = async (req, res) => {
  try {
    // Tìm khóa học NodeJS và lấy luôn thông tin Giáo viên
    const course = await Course.find({ title: "NodeJS Master" })
    .populate("author", "name");

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourseWithAuthor };
