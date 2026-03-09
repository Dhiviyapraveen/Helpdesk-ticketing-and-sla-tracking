const Ticket = require("../models/ticket");
const User = require("../models/user");

/* ASSIGN TICKET TO AGENT */
exports.assignTicket = async (req, res) => {

  try {

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const agent = await User.findById(req.body.agentId);

    if (!agent || agent.role !== "agent") {
      return res.status(400).json({ message: "Invalid agent" });
    }

    ticket.assignedTo = agent._id;

    await ticket.save();

    res.json(ticket);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ADMIN DASHBOARD */
exports.dashboard = async (req, res) => {

  try {

    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "Open" });
    const closedTickets = await Ticket.countDocuments({ status: "Closed" });
    const breached = await Ticket.countDocuments({ slaBreached: true });

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAgents = await User.countDocuments({ role: "agent" });

    res.json({
      totalTickets,
      openTickets,
      closedTickets,
      breached,
      totalUsers,
      totalAgents
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* GET USERS (EXCLUDE ADMIN) */
exports.getUsers = async (req, res) => {

  try {

    const users = await User.find({
      role: { $ne: "admin" }
    }).select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* GET AGENTS */
exports.getAgents = async (req, res) => {

  try {

    const agents = await User.find({
      role: "agent"
    }).select("-password");

    res.json(agents);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};