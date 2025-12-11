const express = require("express");
const { getCourseDetails } = require("../controllers/course.controller");

const router = express.Router();

router.get("/details", getCourseDetails);

module.exports = router;
