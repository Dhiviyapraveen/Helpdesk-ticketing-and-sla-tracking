const express = require("express");
const router = express.Router();

const {
  assignTicket,
  dashboard,
  getUsers,
  getAgents
} = require("../controllers/adminController");

router.get("/users", getUsers);
router.get("/agents", getAgents);
router.put("/assign/:id", assignTicket);
router.get("/dashboard", dashboard);

module.exports = router;