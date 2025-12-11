require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runDemo() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\nSystem connected to MongoDB Atlas\n');

        console.log('--------------------------------------------------');
        console.log('AGGREGATION (Course Stats by Category)');
        console.log('--------------------------------------------------');
        
        const stats = await Course.aggregate([
            { $match: { isPublished: true } },
            { 
                $group: { 
                    _id: "$category", 
                    AvgPrice: { $avg: "$price" }, 
                    TotalCourses: { $sum: 1 }, 
                    TotalRevenue: { $sum: "$price" }
                } 
            },
            { $sort: { AvgPrice: -1 } } 
        ]);
        
        console.log("Aggregation results:");
        console.table(stats); 
        await delay(2000);

        console.log('\n--------------------------------------------------');
        console.log('RAW QUERY (Native Driver)');
        console.log('--------------------------------------------------');
        
        // Retrieve data via Mongoose
        console.time("MongoooseTime");
        const Data = await Course.find({ price: { $gt: 1000 } });
        console.timeEnd("MongoooseTime");
        console.log("Data via Mongoose:", Data);
        await delay(2000);

        // Retrieve raw data via Native MongoDB Driver (Raw Query)
        console.time("RawQueryTime");
        const rawData = await mongoose.connection.db.collection('courses')
            .find({ price: { $gt: 1000 } })
            .project({ title: 1, price: 1 }) 
            .toArray();
        console.timeEnd("RawQueryTime");

        console.log("Raw data (Plain JSON):", rawData);
        await delay(2000);

        console.log('\n--------------------------------------------------');
        console.log('TRANSACTION (Buy Course)');
        console.log('--------------------------------------------------');

        // Get sample User and Course
        const buyer = await User.findOne({ email: 'an@test.com' });
        const course = await Course.findOne({ title: 'NodeJS Advanced' });
        
        if (!buyer || !course) {
            throw new Error("No user or course found for transaction demo");
        }

        console.log(`User: ${buyer.name} | Balance before purchase: ${buyer.balance}`);
        console.log(`Buying course: ${course.title} | Price: ${course.price}`);

        // START TRANSACTION
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Step 1: Deduct money
            const userUpdate = await User.findOneAndUpdate(
                { _id: buyer._id, balance: { $gte: course.price } },
                { $inc: { balance: -course.price } },
                { new: true, session } // Pass session
            );

            if(!userUpdate) throw new Error("Insufficient funds!");

            // Step 2: Create Enrollment
            await Enrollment.create([{
                user: buyer._id,
                course: course._id,
                priceAtPurchase: course.price
            }], { session }); // Pass session

            // Simulate error to test Rollback (Uncomment the line below when demoing error)
            throw new Error("🔥 Unexpected error occurred after deducting money!");

            await session.commitTransaction();
            console.log("\nTRANSACTION SUCCESSFUL (COMMIT)");
            
            const userAfter = await User.findById(buyer._id);
            console.log(`Balance after purchase: ${userAfter.balance}`);

        } catch (error) {
            await session.abortTransaction();
            console.log(`\nTRANSACTION FAILED (ROLLBACK): ${error.message}`);
            const userAfter = await User.findById(buyer._id);
            console.log(`Balance preserved: ${userAfter.balance}`);
        } finally {
            session.endSession();
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect(); // Close connection when script finishes
    }
}

runDemo();