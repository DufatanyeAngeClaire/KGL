const Produce = require("../models/Produce");

// Add Produce (Manager Only)
exports.addProduce = async (req, res) => {
  try {
    const {
      name,
      type,
      tonnage,
      cost,
      sellingPrice,
      dealerName,
      dealerContact,
      branch,
      date
    } = req.body;

    // ===== VALIDATIONS =====

    if (!/^[A-Za-z0-9 ]+$/.test(name)) {
      return res.status(400).json({ message: "Invalid produce name" });
    }

    if (!/^[A-Za-z]{2,}$/.test(type)) {
      return res.status(400).json({ message: "Type must be alphabets only and at least 2 characters" });
    }

    if (!tonnage || tonnage < 100) {
      return res.status(400).json({ message: "Tonnage must be numeric and at least 3 digits" });
    }

    if (!cost || cost < 10000) {
      return res.status(400).json({ message: "Cost must be at least 5 digits" });
    }

    if (!sellingPrice || sellingPrice < 10000) {
      return res.status(400).json({ message: "Selling price must be at least 5 digits" });
    }

    if (!/^[A-Za-z0-9 ]{2,}$/.test(dealerName)) {
      return res.status(400).json({ message: "Dealer name must be at least 2 characters" });
    }

    if (!/^(07|01)[0-9]{8}$/.test(dealerContact)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // ===== CHECK IF PRODUCE EXISTS IN SAME BRANCH =====

    let existingProduce = await Produce.findOne({
      name,
      branch
    });

    if (existingProduce) {

      // Increase stock
      existingProduce.tonnage += Number(tonnage);

      // Optional: update selling price if manager changed it
      existingProduce.sellingPrice = sellingPrice;

      await existingProduce.save();

      return res.status(200).json({
        message: "Stock updated successfully",
        produce: existingProduce
      });

    } else {

      const newProduce = await Produce.create({
        name,
        type,
        tonnage,
        cost,
        sellingPrice,
        dealerName,
        dealerContact,
        branch,
        date
      });

      return res.status(201).json({
        message: "New produce recorded successfully",
        produce: newProduce
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLowStock = async (req, res) => {
  try {

    const branch = req.user.branch;

    const lowStockItems = await Produce.find({
      branch,
      tonnage: { $lt: 500 }
    });

    res.status(200).json(lowStockItems);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};