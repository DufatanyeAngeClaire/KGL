const express = require("express");
const router = express.Router();
const { addProduce } = require("../controllers/produceController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getLowStock } = require("../controllers/produceController");

// Only manager can add produce
router.post("/add", protect, authorize("manager"), addProduce);
router.get("/low-stock", protect, authorize("manager"), getLowStock);

module.exports = router;



