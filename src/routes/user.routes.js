const express = require("express");
const { getAdvancedUsers } = require("../controllers/user.controller");

const router = express.Router();

router.get("/advanced", getAdvancedUsers);

module.exports = router;
