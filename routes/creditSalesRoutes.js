const express = require("express");
const router = express.Router();
const { recordCreditSale, getCreditSales } = require("../controllers/creditSalesController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ===== POST: Record credit sale =====
router.post("/record", protect, authorize("manager", "sales"), recordCreditSale);

// ===== GET: View credit sales =====
router.get("/", protect, authorize("manager", "director"), getCreditSales);

module.exports = router;