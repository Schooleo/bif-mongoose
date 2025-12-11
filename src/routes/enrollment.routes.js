const express = require("express");
const { getEnrollmentDetails } = require("../controllers/enrollment.controller");

const router = express.Router();

router.get("/details", getEnrollmentDetails);

module.exports = router;
