const express = require("express")
const router = express.Router()

// Make sure the path exists!
const { getDashboardData } = require("../controllers/dashboard")

router.get("/", getDashboardData)

module.exports = router