const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getMyTickets,
  updateTicketStatus,
} = require("../controllers/agentController");

router.get("/tickets", protect, getMyTickets);
router.put("/tickets/:id", protect, updateTicketStatus);

module.exports = router;
