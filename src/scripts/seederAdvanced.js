// Data Seeder Script
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas for Seeding...');

    // Clean up old data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('Cleaned old data.');

    // Demo Users
    const users = await User.insertMany([
      { name: 'An Nguyen', email: 'an@test.com', balance: 5000 }, 
      { name: 'Bao Doan', email: 'bao@test.com', balance: 100 }
    ]);
    console.log(`Created ${users.length} users.`);

    // Demo Courses
    const courses = await Course.insertMany([
      { title: 'NodeJS Advanced', category: 'Backend', price: 1000, isPublished: true },
      { title: 'MongoDB Masterclass', category: 'Backend', price: 1200, isPublished: true },
      { title: 'React Basics', category: 'Frontend', price: 800, isPublished: true },
      { title: 'VueJS Pro', category: 'Frontend', price: 900, isPublished: true },
      { title: 'Hidden Secret Course', category: 'Secret', price: 9999, isPublished: false } 
    ]);
    console.log(`Created ${courses.length} courses.`);

    console.log('Seeding Completed!');
    process.exit();
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
}

seedData();