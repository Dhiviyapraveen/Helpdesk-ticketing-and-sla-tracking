const Ticket = require("../models/ticket");
const calculateSLA = require("../utils/slaCalculator");

exports.createTicket = async (req, res) => {
  const { title, description, priority } = req.body;

  const ticket = await Ticket.create({
    title,
    description,
    priority,
    createdBy: req.user.id,
    slaDeadline: calculateSLA(priority),
  });

  res.json(ticket);
};

exports.getTickets = async (req, res) => {
  const tickets = await Ticket.find().populate("createdBy assignedTo");
  res.json(tickets);
};

exports.updateStatus = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  ticket.status = req.body.status;

  if (new Date() > ticket.slaDeadline && ticket.status !== "Resolved") {
    ticket.slaBreached = true;
  }

  await ticket.save();
  res.json(ticket);
};

exports.addComment = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  ticket.comments.push({
    message: req.body.message,
    postedBy: req.user.id,
  });

  await ticket.save();
  res.json(ticket);
};