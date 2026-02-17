const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/dashboardController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getStats);

module.exports = router;
