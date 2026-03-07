const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/user");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// CORS
const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:8081"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Create default admin
const createAdmin = async () => {

  const admin = await User.findOne({ email: "admin@gmail.com" });

  if (!admin) {

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Default admin created");
  }
};

createAdmin();

// Test route
app.get("/", (req, res) => {
  res.send("Helpdesk Backend Running ✅");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});