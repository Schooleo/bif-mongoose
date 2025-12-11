require("dotenv").config();
const connectDB = require("../config/db");
const { User, Course, Enrollment } = require("../models");

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Enrollment.deleteMany({}),
    ]);

    console.log("🧹 Cơ sở dữ liệu sạch, bắt đầu tạo dữ liệu mẫu...");

    const teacher = await User.create({
      name: "Thầy Ba",
      email: "ba@test.com",
      role: "teacher",
      age: 35,
    });

    const students = [];
    for (let i = 1; i <= 20; i += 1) {
      students.push({
        name: `Sinh viên ${i}`,
        email: `sv${i}@test.com`,
        role: "student",
        age: 18 + (i % 5),
      });
    }

    const createdStudents = await User.insertMany(students);

    const nodejs = await Course.create({
      title: "NodeJS Master",
      price: 200,
      author: teacher._id,
    });
    const reactjs = await Course.create({
      title: "ReactJS Pro",
      price: 150,
      author: teacher._id,
    });

    await Enrollment.create({
      student: createdStudents[0]._id,
      course: nodejs._id,
      grade: 8,
    });
    await Enrollment.create({
      student: createdStudents[0]._id,
      course: reactjs._id,
      grade: 9,
    });
    await Enrollment.create({
      student: createdStudents[1]._id,
      course: nodejs._id,
      grade: 4,
    });

    console.log("✅ Seeder hoàn tất.");
  } catch (error) {
    console.error("Seeder error:", error);
  } finally {
    process.exit();
  }
};

seed();
