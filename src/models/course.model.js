// Course Schema - Each course belongs to one Author (User)
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, 
  price: { type: Number, required: true },    
  isPublished: { type: Boolean, default: false } 
});

module.exports = mongoose.model('Course', courseSchema);