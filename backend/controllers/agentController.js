const Ticket = require("../models/ticket");

/* GET TICKETS ASSIGNED TO AGENT */

exports.getMyTickets = async (req, res) => {

  try {

    const tickets = await Ticket.find({
      assignedTo: req.user.id
    });

    res.json(tickets);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* UPDATE TICKET STATUS */

exports.updateTicketStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};