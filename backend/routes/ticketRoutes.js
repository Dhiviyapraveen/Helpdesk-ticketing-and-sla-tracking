const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createTicket,
  getTickets,
  updateStatus,
  addComment,
} = require("../controllers/ticketController");

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.put("/:id", protect, updateStatus);
router.post("/:id/comment", protect, addComment);

module.exports = router;