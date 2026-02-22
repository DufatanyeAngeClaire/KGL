const express = require("express");
const router = express.Router();
const { recordSale } = require("../controllers/salesController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Manager & Sales agents can record sales
router.post("/record", protect, authorize("manager", "sales"), recordSale);

module.exports = router;