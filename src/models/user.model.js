const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    age: { type: Number, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
