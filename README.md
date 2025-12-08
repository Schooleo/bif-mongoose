# bif-mongoose
# 🍃 Mongoose & MongoDB: Advanced ODM Tutorial

![NodeJS](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=node.js&logoColor=61DAFB)
![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

> **Topic:** Step-by-step tutorial on using Mongoose ORM with MongoDB (NoSQL).

## 📹 Video Tutorial
[**Click here to watch our Step-by-Step Video Guide**](#)

---

## 📋 Project Requirements & Checklist
This project demonstrates the following technical requirements based on the assignment criteria, applied to a **Course Management System** (E-learning) context:

- [x] **Schema Definition (Code-First):** Defined Schemas, Data Types, Validations, Keys, and Constraints.
- [x] **Schema Migration:** Handling schema changes and updates.
- [x] **Data Seeding:** Automated script to generate sample data.
- [x] **CRUD Operations:**
    - [x] Insert, Update, Soft Delete.
    - [x] Select with `Where`, `Limit`, `Offset` (Pagination), `Sort`.
- [x] **Relationships:**
    - [x] One-to-Many (User -> Courses).
    - [x] Many-to-Many (Students <-> Courses via Enrollment).
    - [x] Population (Join) & Eager Loading.
- [x] **Advanced Techniques:**
    - [x] Aggregation & Grouping (Count, Sum, Avg, Group By).
    - [x] Transactions (ACID compliance).
    - [x] Raw SQL/Mongo Queries (Bypassing Mongoose).

---

## 🛠 Installation & Setup

### 1. Prerequisites
Ensure you have the following installed:
* Node.js (v14+)
* MongoDB (Local installation or Atlas URI)

### 2. Clone the Repo
```bash
git clone [https://github.com/your-username/mongoose-tutorial-demo.git](https://github.com/your-username/mongoose-tutorial-demo.git)
cd mongoose-tutorial-demo
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configuration (.env)
Create a .env file in the root directory and add your connection string:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/elearning_db
# Or your MongoDB Atlas connection string
```

## 🚀 How to Run

### 1. Database Seeding (Important)
Before testing APIs, populate the database with our sample data script. This creates Users, Courses, and Enrollments automatically.

```bash
# Run the seeder script
npm run seed
```

### 2. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```
_Server runs on: ```http://localhost:3000```_

## 📂 Project Structure

This project is organized to separate concerns clearly:

```plaintext
├── src
│   ├── config
│   │   └── db.js           # Database Connection
│   ├── models              # Mongoose Schemas (Code-First)
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Enrollment.js
│   ├── controllers         # Logic for CRUD, Aggregation, etc.
│   ├── routes              # API Routes
│   └── scripts
│       └── seeder.js       # Data Seeding Script
├── .env
├── server.js               # Server entry point
└── README.md
```

## 👥 Members

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/KwanTheAsian">
        <img src="https://avatars.githubusercontent.com/KwanTheAsian" width="100px;" alt="KwanTheAsian"/><br />
        <sub><b>23127020 - Biện Xuân An</b></sub>
      </a><br />
      ✅ Advanced & Aggregation
    </td>
    <td align="center">
      <a href="https://github.com/PaoPao1406">
        <img src="https://avatars.githubusercontent.com/PaoPao1406" width="100px;" alt="PaoPao1406"/><br />
        <sub><b>23127025 - Đoàn Lê Gia Bảo</b></sub>
      </a><br />
      ✅ Seeder & Basic CRUD
    </td>
    <td align="center">
      <a href="https://github.com/VNQuy94">
        <img src="https://avatars.githubusercontent.com/VNQuy94" width="100px;" alt="VNQuy94"/><br />
        <sub><b>23127114 - Văn Ngọc Quý</b></sub>
      </a><br />
      ✅ Query & Relationships
    </td>
    <td align="center">
      <a href="https://github.com/Schooleo">
        <img src="https://avatars.githubusercontent.com/Schooleo" width="100px;" alt="Schooleo"/><br />
        <sub><b>23127136 - Lê Nguyễn Nhật Trường</b></sub>
      </a><br />
      ✅ Intro & Schemas
    </td>
  </tr>
</table>
