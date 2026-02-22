const express = require("express");
const router = express.Router();
const { getSalesSummary } = require("../controllers/directorController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ONLY Director can access
router.get("/summary", protect, authorize("director"), getSalesSummary);

module.exports = router;