const express = require("express");
const { ageDistribution, activeUsers } = require("../controllers/analyticsController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Analytics Routes
router.get("/age-distribution", authenticate, authorize(["admin"]), ageDistribution);
router.get("/active-users", authenticate, authorize(["admin"]), activeUsers);

module.exports = router;
