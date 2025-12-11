const mongoose = require("mongoose");
const { Schema } = mongoose;

const enrollmentSchema = new Schema({
  // 2 Khóa ngoại trỏ về 2 bảng
  student: { type: Schema.Types.ObjectId, ref: "User" },
  course: { type: Schema.Types.ObjectId, ref: "Course" },

  // Metadata (Dữ liệu ngữ cảnh)
  grade: { type: Number, min: 0, max: 10 },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
