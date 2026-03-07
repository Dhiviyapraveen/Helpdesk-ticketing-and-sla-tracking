const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slaDeadline: Date,
    slaBreached: { type: Boolean, default: false },
    comments: [
      {
        message: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);