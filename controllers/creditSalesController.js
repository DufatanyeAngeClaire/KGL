const CreditSale = require("../models/CreditSale");
const Produce = require("../models/Produce");

// ===== RECORD CREDIT SALE =====
exports.recordCreditSale = async (req, res) => {
  try {
    const {
      buyerName,
      nationalId,
      location,
      contact,
      amountDue,
      dueDate,
      produceName,
      type,
      tonnage
    } = req.body;

    const branch = req.user.branch;
    const salesAgent = req.user.fullName;

    // ===== VALIDATIONS =====
    if (!/^[A-Za-z0-9 ]{2,}$/.test(buyerName)) {
      return res.status(400).json({ message: "Invalid buyer name" });
    }

    if (!/^[A-Z0-9]{8,14}$/.test(nationalId)) {
      return res.status(400).json({ message: "Invalid National ID format" });
    }

    if (!/^[A-Za-z0-9 ]{2,}$/.test(location)) {
      return res.status(400).json({ message: "Invalid location" });
    }

    if (!/^(07|01)[0-9]{8}$/.test(contact)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    if (!amountDue || amountDue < 10000) {
      return res.status(400).json({ message: "Amount due must be at least 5 digits" });
    }

    if (!tonnage || tonnage < 1) {
      return res.status(400).json({ message: "Invalid tonnage value" });
    }

    // ===== CHECK STOCK =====
    const produce = await Produce.findOne({ name: produceName, branch });
    if (!produce) {
      return res.status(404).json({ message: "Produce not found in this branch" });
    }
    if (produce.tonnage < tonnage) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // ===== REDUCE STOCK =====
    produce.tonnage -= tonnage;
    await produce.save();

    // ===== RECORD CREDIT SALE =====
    const creditSale = await CreditSale.create({
      buyerName,
      nationalId,
      location,
      contact,
      amountDue,
      salesAgent,
      dueDate,
      produceName,
      type,
      tonnage,
      branch
    });

    res.status(201).json({
      message: "Credit sale recorded successfully",
      creditSale,
      remainingStock: produce.tonnage
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== GET ALL CREDIT SALES =====
exports.getCreditSales = async (req, res) => {
  try {
    const role = req.user.role;
    const branch = req.user.branch;

    let creditSales;

    if (role === "director") {
      // Director sees all branches
      creditSales = await CreditSale.find().sort({ createdAt: -1 });
    } else {
      // Managers see only their branch
      creditSales = await CreditSale.find({ branch }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      message: "Credit sales retrieved successfully",
      creditSales
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};