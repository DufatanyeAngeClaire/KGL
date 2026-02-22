const mongoose = require("mongoose");

const creditSaleSchema = new mongoose.Schema({
  buyerName: {
    type: String,
    required: true
  },
  nationalId: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  amountDue: {
    type: Number,
    required: true
  },
  salesAgent: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  produceName: {
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
  dispatchDate: {
    type: Date,
    default: Date.now
  },
  branch: {
    type: String,
    enum: ["Maganjo", "Matugga"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("CreditSale", creditSaleSchema);