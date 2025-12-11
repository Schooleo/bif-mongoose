const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    title: { type: String, required: true },
    price: Number,
    
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // Phải khớp với tên model trong user.model.js
        required: true 
    }
});

module.exports = mongoose.model('Course', courseSchema);