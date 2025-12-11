// User Controller
const User = require('../models/user.model');

const getAdvancedUsers = async (req, res) => {
    try {
        const users = await User.find({
            // 1. FILTER
            role: 'student',
            age: {$gte: 19}
        })
        // 2. SORT (Mới nhất lên đầu)
        .sort({ createdAt: -1 })
        
        // 3. PAGINATION
        .skip(0).limit(5)

        // 4. PROJECTION (Chỉ lấy field cần thiết)
        .select('name email age -_id');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdvancedUsers };