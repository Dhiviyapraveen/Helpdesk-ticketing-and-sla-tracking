const Ticket = require("../models/ticket");

exports.assignTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  ticket.assignedTo = req.body.agentId;
  await ticket.save();

  res.json(ticket);
};

exports.dashboard = async (req, res) => {
  const total = await Ticket.countDocuments();
  const breached = await Ticket.countDocuments({ slaBreached: true });

  res.json({ total, breached });
};