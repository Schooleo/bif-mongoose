const Enrollment = require("../models/enrollment.model");

const getEnrollmentDetails = async (req, res) => {
  try {
    // Lấy danh sách sinh viên đậu môn (grade >= 5)
    const enrollments = await Enrollment.find({ grade: { $gte: 5 } })
      .populate("student", "name") // Lấy tên SV
      .populate("course", "title price"); // Lấy tên Môn học

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEnrollmentDetails };
