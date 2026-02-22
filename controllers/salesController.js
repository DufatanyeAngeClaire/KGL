const Sale = require("../models/Sale");
const Produce = require("../models/Produce");

exports.recordSale = async (req, res) => {
  try {
    const { produceName, tonnage, amountPaid, buyerName } = req.body;
    const branch = req.user.branch;
    const salesAgent = req.user.fullName || "Agent";

    // ===== VALIDATIONS =====
    if (!/^[A-Za-z0-9 ]{2,}$/.test(buyerName)) {
      return res.status(400).json({ message: "Buyer name must be at least 2 characters" });
    }

    if (!tonnage || tonnage < 1) {
      return res.status(400).json({ message: "Invalid tonnage value" });
    }

    if (!amountPaid || amountPaid < 10000) {
      return res.status(400).json({ message: "Amount paid must be at least 5 digits" });
    }

    // ===== CHECK STOCK =====
    const produce = await Produce.findOne({
      name: { $regex: new RegExp(`^${produceName.trim()}$`, "i") },
      branch: { $regex: new RegExp(`^${branch.trim()}$`, "i") }
    });

    if (!produce) {
      return res.status(404).json({ message: "Produce not found in this branch" });
    }

    if (produce.tonnage < tonnage) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    if (produce.tonnage === 0) {
      console.log("Stock finished for", produce.name);
    }

    // ===== REDUCE STOCK =====
    produce.tonnage -= tonnage;
    await produce.save();

    // ===== RECORD SALE =====
    const sale = await Sale.create({
      produceName,
      tonnage,
      amountPaid,
      buyerName,
      salesAgent,
      branch
    });

    res.status(201).json({
      message: "Sale recorded successfully",
      sale,
      remainingStock: produce.tonnage
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};