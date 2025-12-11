// User Routes
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserWithUpdateOne,
  deleteUser,
  getUserStats,
} = require('../controllers/user.controller');

// Base routes
router
  .route('/')
  .get(getAllUsers) // GET /api/users
  .post(createUser); // POST /api/users

// ID-based routes
router
  .route('/:id')
  .get(getUserById) // GET /api/users/:id
  .put(updateUser) // PUT /api/users/:id
  .delete(deleteUser); // DELETE /api/users/:id

// Stats route
router.route('/:id/stats').get(getUserStats); // GET /api/users/:id/stats

// Alternative update route using updateOne
router.route('/:id/alt').put(updateUserWithUpdateOne); // PUT /api/users/:id/alt

module.exports = router;
