const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["manager", "sales", "director"],
    required: true
  },
  branch: {
    type: String,
    enum: ["Maganjo", "Matugga"]
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);