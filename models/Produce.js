const mongoose = require("mongoose");

const produceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  tonnage: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  dealerName: {
    type: String,
    required: true
  },
  dealerContact: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    enum: ["Maganjo", "Matugga"],
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Produce", produceSchema);