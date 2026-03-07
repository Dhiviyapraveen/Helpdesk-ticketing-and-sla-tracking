const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { assignTicket, dashboard } = require("../controllers/adminController");

router.put("/assign/:id", protect, authorize("admin"), assignTicket);
router.get("/dashboard", protect, authorize("admin"), dashboard);

module.exports = router;