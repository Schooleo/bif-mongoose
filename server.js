const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// JSON Middleware
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
