const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/produce", require("./routes/produceRoutes"));
app.use("/api/sales", require("./routes/salesRoutes"));
app.use("/api/credit-sales", require("./routes/creditSalesRoutes"));
app.use("/api/director", require("./routes/directorRoutes"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server AFTER routes are registered
app.listen(5000, () => console.log("Server running on port 5000"));