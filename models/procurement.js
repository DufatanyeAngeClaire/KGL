const mongoose = require("mongoose");

const procurementSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  amount: Number,
  status: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Procurement", procurementSchema);