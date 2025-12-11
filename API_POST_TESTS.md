# Bộ Test API POST

## 📌 Setup

Đảm bảo server đang chạy:

```bash
npm start
# hoặc
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

---

## 1️⃣ POST - Create User

### Endpoint

```
POST http://localhost:3000/api/users
```

### Headers

```
Content-Type: application/json
```

### Test Case 1: Tạo Student thành công

```json
{
  "name": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "password": "password123",
  "role": "student",
  "bio": "I am a passionate learner interested in web development",
  "avatar": "avatar-student-1.jpg"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "name": "Nguyen Van A",
    "email": "nguyenvana@example.com",
    "role": "student",
    "bio": "I am a passionate learner interested in web development",
    "avatar": "avatar-student-1.jpg",
    "isActive": true,
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Test Case 2: Tạo Instructor thành công

```json
{
  "name": "Tran Thi B",
  "email": "tranthib@example.com",
  "password": "securepass456",
  "role": "instructor",
  "bio": "Expert in full-stack development with 10 years of experience"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "name": "Tran Thi B",
    "email": "tranthib@example.com",
    "role": "instructor",
    "bio": "Expert in full-stack development with 10 years of experience",
    "avatar": "default-avatar.png",
    "isActive": true,
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Test Case 3: Tạo Admin thành công

```json
{
  "name": "Le Van C",
  "email": "levanc@example.com",
  "password": "adminpass789",
  "role": "admin",
  "bio": "System administrator"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "name": "Le Van C",
    "email": "levanc@example.com",
    "role": "admin",
    "bio": "System administrator",
    "avatar": "default-avatar.png",
    "isActive": true,
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Test Case 4: Lỗi - Email đã tồn tại

```json
{
  "name": "Duplicate User",
  "email": "nguyenvana@example.com",
  "password": "password123",
  "role": "student"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### Test Case 5: Lỗi - Thiếu trường bắt buộc (name)

```json
{
  "email": "test@example.com",
  "password": "password123",
  "role": "student"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating user",
  "error": "User validation failed: name: Name is required"
}
```

---

### Test Case 6: Lỗi - Email không hợp lệ

```json
{
  "name": "Test User",
  "email": "invalid-email",
  "password": "password123",
  "role": "student"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating user",
  "error": "User validation failed: email: Please provide a valid email"
}
```

---

### Test Case 7: Lỗi - Password quá ngắn

```json
{
  "name": "Test User",
  "email": "test2@example.com",
  "password": "12345",
  "role": "student"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating user",
  "error": "User validation failed: password: Password must be at least 6 characters"
}
```

---

### Test Case 8: Lỗi - Role không hợp lệ

```json
{
  "name": "Test User",
  "email": "test3@example.com",
  "password": "password123",
  "role": "superadmin"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating user",
  "error": "User validation failed: role: `superadmin` is not a valid enum value for path `role`"
}
```

---

## 2️⃣ POST - Create Course

### Endpoint

```
POST http://localhost:3000/api/courses
```

### Headers

```
Content-Type: application/json
```

### ⚠️ Chuẩn bị: Lấy Instructor ID

Trước tiên, cần lấy ID của một instructor từ database:

```
GET http://localhost:3000/api/users?role=instructor
```

Sao chép `_id` của một instructor để sử dụng trong các test case bên dưới.

---

### Test Case 1: Tạo Course thành công

```json
{
  "title": "Complete Node.js Bootcamp 2025",
  "description": "Master Node.js by building real-world applications. Learn Express, MongoDB, authentication, security, and much more in this comprehensive course.",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "Programming",
  "level": "Intermediate",
  "duration": 30,
  "price": 99.99,
  "thumbnail": "nodejs-bootcamp.jpg",
  "tags": ["nodejs", "express", "mongodb", "backend"],
  "isPublished": true
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "title": "Complete Node.js Bootcamp 2025",
    "description": "Master Node.js by building real-world applications...",
    "author": {
      "_id": "675974d7e7f41bfc9a37f4a9",
      "name": "John Smith",
      "email": "john.smith0@example.com",
      "avatar": "avatar-1.jpg"
    },
    "category": "Programming",
    "level": "Intermediate",
    "duration": 30,
    "price": 99.99,
    "thumbnail": "nodejs-bootcamp.jpg",
    "tags": ["nodejs", "express", "mongodb", "backend"],
    "isPublished": true,
    "rating": 0,
    "totalEnrollments": 0,
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Test Case 2: Tạo Free Course

```json
{
  "title": "Introduction to HTML & CSS",
  "description": "Learn the fundamentals of web development with HTML and CSS. Perfect for absolute beginners who want to start their journey in web development.",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "Programming",
  "level": "Beginner",
  "duration": 10,
  "price": 0,
  "tags": ["html", "css", "web development"],
  "isPublished": true
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "title": "Introduction to HTML & CSS",
    "price": 0,
    "thumbnail": "default-course.jpg",
    ...
  }
}
```

---

### Test Case 3: Tạo Course với các category khác nhau

**Design Category:**

```json
{
  "title": "UI/UX Design Masterclass",
  "description": "Learn professional UI/UX design principles and create stunning user interfaces. Master Figma, prototyping, and user research.",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "Design",
  "level": "Advanced",
  "duration": 25,
  "price": 149.99,
  "tags": ["ui", "ux", "figma", "design"]
}
```

**Business Category:**

```json
{
  "title": "Digital Marketing Strategy 2025",
  "description": "Complete guide to digital marketing including SEO, SEM, social media marketing, content marketing, and analytics.",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "Business",
  "level": "Intermediate",
  "duration": 20,
  "price": 79.99,
  "tags": ["marketing", "seo", "social media"]
}
```

**Data Science Category:**

```json
{
  "title": "Python for Data Science and Machine Learning",
  "description": "Learn data science and machine learning with Python. Master pandas, numpy, scikit-learn, and build real ML models.",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "Data Science",
  "level": "Advanced",
  "duration": 40,
  "price": 199.99,
  "tags": ["python", "data science", "machine learning", "AI"]
}
```

---

### Test Case 4: Lỗi - Author không tồn tại

```json
{
  "title": "Test Course",
  "description": "This course should fail because author doesn't exist",
  "author": "000000000000000000000000",
  "category": "Programming",
  "level": "Beginner",
  "duration": 10,
  "price": 50
}
```

**Expected Response (404):**

```json
{
  "success": false,
  "message": "Author not found"
}
```

---

### Test Case 5: Lỗi - Author không phải Instructor

Lấy ID của một student:

```
GET http://localhost:3000/api/users?role=student
```

```json
{
  "title": "Test Course",
  "description": "This course should fail because author is not an instructor",
  "author": "675974d7e7f41bfc9a37f4b5",
  "category": "Programming",
  "level": "Beginner",
  "duration": 10,
  "price": 50
}
```

**Expected Response (403):**

```json
{
  "success": false,
  "message": "Only instructors can create courses"
}
```

---

### Test Case 6: Lỗi - Thiếu trường bắt buộc (title)

```json
{
  "description": "Missing title field",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "Programming",
  "level": "Beginner",
  "duration": 10,
  "price": 50
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating course",
  "error": "Course validation failed: title: Course title is required"
}
```

---

### Test Case 7: Lỗi - Title quá ngắn

```json
{
  "title": "Test",
  "description": "This title is too short (less than 5 characters)",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "Programming",
  "level": "Beginner",
  "duration": 10,
  "price": 50
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating course",
  "error": "Course validation failed: title: Title must be at least 5 characters"
}
```

---

### Test Case 8: Lỗi - Description quá ngắn

```json
{
  "title": "Valid Title Here",
  "description": "Too short",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "Programming",
  "level": "Beginner",
  "duration": 10,
  "price": 50
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating course",
  "error": "Course validation failed: description: Description must be at least 20 characters"
}
```

---

### Test Case 9: Lỗi - Category không hợp lệ

```json
{
  "title": "Valid Title Here",
  "description": "This is a valid description with more than 20 characters",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "InvalidCategory",
  "level": "Beginner",
  "duration": 10,
  "price": 50
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating course",
  "error": "Course validation failed: category: `InvalidCategory` is not a valid enum value"
}
```

---

### Test Case 10: Lỗi - Price âm

```json
{
  "title": "Valid Title Here",
  "description": "This is a valid description with more than 20 characters",
  "author": "675974d7e7f41bfc9a37f4a9",
  "category": "Programming",
  "level": "Beginner",
  "duration": 10,
  "price": -50
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating course",
  "error": "Course validation failed: price: Price cannot be negative"
}
```

---

## 3️⃣ POST - Create Enrollment

### Endpoint

```
POST http://localhost:3000/api/enrollments
```

### Headers

```
Content-Type: application/json
```

### ⚠️ Chuẩn bị: Lấy Student ID và Course ID

```
GET http://localhost:3000/api/users?role=student
GET http://localhost:3000/api/courses
```

Sao chép các ID cần thiết.

---

### Test Case 1: Enrollment thành công - Free Course

```json
{
  "student": "675974d7e7f41bfc9a37f4b5",
  "course": "675974d8e7f41bfc9a37f4d3"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Enrollment created successfully",
  "data": {
    "student": {
      "_id": "675974d7e7f41bfc9a37f4b5",
      "name": "Michael Williams",
      "email": "michael.williams10@example.com",
      "avatar": "avatar-11.jpg"
    },
    "course": {
      "_id": "675974d8e7f41bfc9a37f4d3",
      "title": "Complete Web Development Bootcamp",
      "category": "Programming",
      "price": 20
    },
    "enrolledAt": "...",
    "status": "active",
    "progress": 0,
    "paymentStatus": "free",
    "paymentAmount": 0,
    "_id": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Test Case 2: Enrollment thành công - Paid Course

```json
{
  "student": "675974d7e7f41bfc9a37f4b6",
  "course": "675974d8e7f41bfc9a37f4d4",
  "paymentStatus": "paid",
  "paymentAmount": 99.99
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Enrollment created successfully",
  "data": {
    "student": {...},
    "course": {...},
    "status": "active",
    "progress": 0,
    "paymentStatus": "paid",
    "paymentAmount": 99.99,
    ...
  }
}
```

---

### Test Case 3: Enrollment với Payment Pending

```json
{
  "student": "675974d7e7f41bfc9a37f4b7",
  "course": "675974d8e7f41bfc9a37f4d5",
  "paymentStatus": "pending"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Enrollment created successfully",
  "data": {
    "paymentStatus": "pending",
    ...
  }
}
```

---

### Test Case 4: Lỗi - Student không tồn tại

```json
{
  "student": "000000000000000000000000",
  "course": "675974d8e7f41bfc9a37f4d3"
}
```

**Expected Response (404):**

```json
{
  "success": false,
  "message": "Student not found"
}
```

---

### Test Case 5: Lỗi - Course không tồn tại

```json
{
  "student": "675974d7e7f41bfc9a37f4b5",
  "course": "000000000000000000000000"
}
```

**Expected Response (404):**

```json
{
  "success": false,
  "message": "Course not found"
}
```

---

### Test Case 6: Lỗi - Enrollment đã tồn tại (Duplicate)

Sử dụng lại student và course từ Test Case 1:

```json
{
  "student": "675974d7e7f41bfc9a37f4b5",
  "course": "675974d8e7f41bfc9a37f4d3"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Student is already enrolled in this course"
}
```

---

### Test Case 7: Lỗi - Thiếu trường bắt buộc (student)

```json
{
  "course": "675974d8e7f41bfc9a37f4d3"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating enrollment",
  "error": "Enrollment validation failed: student: Student is required"
}
```

---

### Test Case 8: Lỗi - Thiếu trường bắt buộc (course)

```json
{
  "student": "675974d7e7f41bfc9a37f4b5"
}
```

**Expected Response (400):**

```json
{
  "success": false,
  "message": "Error creating enrollment",
  "error": "Enrollment validation failed: course: Course is required"
}
```

---

## 🧪 Testing với cURL

### User

```bash
# Test Case 1: Create Student
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyen Van A",
    "email": "nguyenvana@example.com",
    "password": "password123",
    "role": "student",
    "bio": "I am a passionate learner"
  }'

# Test Case 2: Create Instructor
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tran Thi B",
    "email": "tranthib@example.com",
    "password": "securepass456",
    "role": "instructor",
    "bio": "Expert in full-stack development"
  }'
```

### Course

```bash
# Replace INSTRUCTOR_ID with actual instructor ID
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Node.js Bootcamp 2025",
    "description": "Master Node.js by building real-world applications",
    "author": "INSTRUCTOR_ID",
    "category": "Programming",
    "level": "Intermediate",
    "duration": 30,
    "price": 99.99,
    "tags": ["nodejs", "express", "mongodb"],
    "isPublished": true
  }'
```

### Enrollment

```bash
# Replace STUDENT_ID and COURSE_ID with actual IDs
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "student": "STUDENT_ID",
    "course": "COURSE_ID",
    "paymentStatus": "paid",
    "paymentAmount": 99.99
  }'
```

---

## 🧪 Testing với Postman

1. **Import Collection**: Tạo một Collection mới trong Postman
2. **Set Base URL**: Tạo environment variable `base_url = http://localhost:3000`
3. **Add Requests**: Tạo các request như trên
4. **Run Collection**: Chạy toàn bộ test suite

---

## 📊 Test Checklist

### User POST Tests

- [x] ✅ Tạo student thành công
- [x] ✅ Tạo instructor thành công
- [x] ✅ Tạo admin thành công
- [x] ❌ Email đã tồn tại
- [x] ❌ Thiếu trường bắt buộc
- [x] ❌ Email không hợp lệ
- [x] ❌ Password quá ngắn
- [x] ❌ Role không hợp lệ

### Course POST Tests

- [x] ✅ Tạo course thành công
- [x] ✅ Tạo free course
- [x] ✅ Các category khác nhau
- [x] ❌ Author không tồn tại
- [x] ❌ Author không phải instructor
- [x] ❌ Thiếu trường bắt buộc
- [x] ❌ Validation errors

### Enrollment POST Tests

- [x] ✅ Enrollment thành công - free course
- [x] ✅ Enrollment thành công - paid course
- [x] ✅ Payment pending
- [x] ❌ Student không tồn tại
- [x] ❌ Course không tồn tại
- [x] ❌ Enrollment đã tồn tại
- [x] ❌ Thiếu trường bắt buộc

---

## 🎯 Tips

1. **Lấy ID từ Database**: Luôn kiểm tra và lấy ID thực tế từ các GET endpoints trước khi test POST
2. **Test theo thứ tự**: Test User → Course → Enrollment
3. **Kiểm tra Response**: Đảm bảo status code và response body đúng như mong đợi
4. **Clean Data**: Sử dụng `npm run seed` để reset database trước khi test lại
5. **Log Errors**: Kiểm tra console của server để xem chi tiết lỗi nếu có

---

**Happy Testing! 🚀**
