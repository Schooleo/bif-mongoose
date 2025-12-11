// Data Seeder Script
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning_db');
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Sample data generators
const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];
const roles = ['student', 'instructor', 'admin'];
const statuses = ['active', 'completed', 'dropped', 'pending'];

const firstNames = [
  'John',
  'Jane',
  'Michael',
  'Emily',
  'David',
  'Sarah',
  'Robert',
  'Lisa',
  'James',
  'Mary',
  'William',
  'Patricia',
  'Richard',
  'Jennifer',
  'Thomas',
  'Linda',
  'Charles',
  'Elizabeth',
  'Daniel',
  'Susan',
  'Matthew',
  'Jessica',
  'Joseph',
  'Karen',
  'Christopher',
  'Nancy',
  'Anthony',
  'Betty',
  'Mark',
  'Helen',
  'Donald',
  'Sandra',
  'Steven',
  'Ashley',
  'Paul',
  'Kimberly',
  'Andrew',
  'Donna',
  'Joshua',
  'Emily',
  'Kenneth',
  'Carol',
  'Kevin',
  'Michelle',
  'Brian',
  'Amanda',
  'George',
  'Melissa',
  'Edward',
  'Deborah',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
  'Walker',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Torres',
  'Nguyen',
  'Hill',
  'Flores',
  'Green',
  'Adams',
  'Nelson',
  'Baker',
  'Hall',
  'Rivera',
  'Campbell',
  'Mitchell',
  'Carter',
  'Roberts',
  'Gomez',
];

const courseTitles = [
  'Complete Web Development Bootcamp',
  'Advanced JavaScript Mastery',
  'Python for Data Science',
  'React and Redux Complete Guide',
  'Node.js Backend Development',
  'UI/UX Design Fundamentals',
  'Digital Marketing Strategy',
  'Machine Learning A-Z',
  'Business Analytics with Excel',
  'Graphic Design Masterclass',
  'MongoDB Database Design',
  'Modern CSS and Sass',
  'Vue.js Complete Course',
  'Angular Framework Guide',
  'Docker and Kubernetes',
  'AWS Cloud Computing',
  'Cybersecurity Essentials',
  'SQL Database Administration',
  'TypeScript Programming',
  'Flutter Mobile Development',
  'iOS Development with Swift',
  'Android App Development',
  'Game Development with Unity',
  'Blockchain Technology',
  'Artificial Intelligence Basics',
  'Data Visualization with D3.js',
  'Express.js REST APIs',
  'Next.js Full Stack',
  'Content Marketing Strategy',
  'Social Media Management',
  'SEO Optimization Guide',
  'Photography for Beginners',
  'Video Editing with Premiere',
  'Adobe Photoshop Complete',
  'Illustrator for Designers',
  'Figma UI Design',
  'Brand Identity Design',
  'Product Management',
  'Agile and Scrum',
  'Financial Accounting',
  'Excel Data Analysis',
  'PowerBI Dashboard Creation',
  'Tableau Data Visualization',
  'Git and GitHub Essentials',
  'Linux System Administration',
  'DevOps Engineering',
  'Testing with Jest',
  'API Development Best Practices',
  'Microservices Architecture',
  'GraphQL Complete Guide',
];

// Generate Users
const generateUsers = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const role = i < 10 ? 'instructor' : i < 12 ? 'admin' : 'student';

    users.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      password: `password${i + 123}`,
      role: role,
      bio: `I am ${firstName} ${lastName}, a passionate ${role} with years of experience in my field.`,
      avatar: `avatar-${i + 1}.jpg`,
      isActive: Math.random() > 0.1,
    });
  }
  return users;
};

// Generate Courses
const generateCourses = (count, instructors) => {
  const courses = [];
  for (let i = 0; i < count; i++) {
    const instructor = instructors[i % instructors.length];

    courses.push({
      title: courseTitles[i % courseTitles.length],
      description: `This comprehensive course covers everything you need to know about ${
        courseTitles[i % courseTitles.length]
      }. Learn from industry experts and gain practical skills that you can apply immediately. Perfect for anyone looking to advance their career.`,
      author: instructor._id,
      category: categories[i % categories.length],
      level: levels[i % levels.length],
      duration: Math.floor(Math.random() * 40) + 10,
      price: Math.floor(Math.random() * 200) + 20,
      thumbnail: `course-${i + 1}.jpg`,
      tags: [`tag${i}`, `skill${i}`, categories[i % categories.length].toLowerCase()],
      isPublished: Math.random() > 0.2,
      rating: (Math.random() * 2 + 3).toFixed(1),
      totalEnrollments: Math.floor(Math.random() * 500),
    });
  }
  return courses;
};

// Generate Enrollments
const generateEnrollments = (students, courses, count) => {
  const enrollments = [];
  const enrollmentSet = new Set();

  let attempts = 0;
  const maxAttempts = count * 10;

  while (enrollments.length < count && attempts < maxAttempts) {
    attempts++;
    const student = students[Math.floor(Math.random() * students.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const key = `${student._id}-${course._id}`;

    if (!enrollmentSet.has(key)) {
      enrollmentSet.add(key);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const progress = status === 'completed' ? 100 : Math.floor(Math.random() * 100);

      enrollments.push({
        student: student._id,
        course: course._id,
        status: status,
        progress: progress,
        completedAt: status === 'completed' ? new Date() : null,
        rating: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : null,
        review: Math.random() > 0.5 ? `This course was amazing! I learned so much.` : null,
        paymentStatus: course.price > 0 ? 'paid' : 'free',
        paymentAmount: course.price,
      });
    }
  }

  return enrollments;
};

// Main Seeder Function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Database Seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create Users
    console.log('👥 Creating 50 users...');
    const usersData = generateUsers(50);
    const users = await User.insertMany(usersData);
    console.log(`✅ Created ${users.length} users\n`);

    // Separate instructors and students
    const instructors = users.filter((u) => u.role === 'instructor');
    const students = users.filter((u) => u.role === 'student');

    console.log(`   - Instructors: ${instructors.length}`);
    console.log(`   - Students: ${students.length}`);
    console.log(`   - Admins: ${users.filter((u) => u.role === 'admin').length}\n`);

    // Create Courses
    console.log('📚 Creating 50 courses...');
    const coursesData = generateCourses(50, instructors);
    const courses = await Course.insertMany(coursesData);
    console.log(`✅ Created ${courses.length} courses\n`);

    // Create Enrollments (50 enrollments)
    console.log('📝 Creating 50 enrollments...');
    const enrollmentsData = generateEnrollments(students, courses, 50);
    const enrollments = await Enrollment.insertMany(enrollmentsData);
    console.log(`✅ Created ${enrollments.length} enrollments\n`);

    // Display summary
    console.log('📊 Seeding Summary:');
    console.log('═══════════════════════════════════');
    console.log(`   Total Users:       ${users.length}`);
    console.log(`   Total Courses:     ${courses.length}`);
    console.log(`   Total Enrollments: ${enrollments.length}`);
    console.log('═══════════════════════════════════');
    console.log('\n✨ Database seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the seeder
connectDB().then(() => {
  seedDatabase();
});
