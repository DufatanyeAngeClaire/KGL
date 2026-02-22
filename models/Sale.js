const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  produceName: {
    type: String,
    required: true
  },
  tonnage: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  salesAgent: {
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
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Sale", saleSchema);