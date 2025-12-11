// User Controller
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');
const mongoose = require('mongoose');

// Buy Course with Transaction (ACID)
exports.buyCourse = async (req, res) => {
  const { userId, courseId } = req.body;

  // Create a session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = await Course.findById(courseId).session(session);
    if (!course) throw new Error('Khóa học không tồn tại');

    // Step 1: Reduce User Balance
    const userUpdate = await User.findOneAndUpdate(
      { _id: userId, balance: { $gte: course.price } }, // Condition: Must have enough balance
      { $inc: { balance: -course.price } }, // Deduct balance
      { new: true, session: session } // Pass session
    );

    if (!userUpdate) {
      throw new Error('Số dư không đủ hoặc User không tồn tại');
    }

    // Step 2: Create Enrollment Record
    await Enrollment.create([{
      user: userId,
      course: courseId,
      priceAtPurchase: course.price
    }], { session: session }); // Pass session

    // If both steps are successful -> Commit (Save changes)
    await session.commitTransaction();
    
    res.status(200).json({
      status: 'success',
      message: 'Transaction successful!',
      remainingBalance: userUpdate.balance
    });

  } catch (error) {
    // If any error occurs -> Abort (Rollback everything)
    await session.abortTransaction();
    res.status(400).json({
      status: 'fail',
      message: 'Transaction failed (Rollback)',
      error: error.message
    });
  } finally {
    // Kết thúc session
    session.endSession();
  }
};