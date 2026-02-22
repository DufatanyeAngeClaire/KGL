const Sale = require("../models/Sale");
const CreditSale = require("../models/CreditSale");

exports.getSalesSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // optional filtering by date

    // Build date filter if provided
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    const saleQuery = startDate || endDate ? { date: dateFilter } : {};
    const creditQuery = startDate || endDate ? { date: dateFilter } : {};

    // ===== NORMAL SALES AGGREGATION =====
    const normalSales = await Sale.aggregate([
      { $match: saleQuery },
      {
        $group: {
          _id: "$branch",
          branch: { $first: "$branch" },
          totalSales: { $sum: "$amountPaid" },
          totalTonnageSold: { $sum: "$tonnage" }
        }
      }
    ]);

    // ===== CREDIT SALES AGGREGATION =====
    const creditSales = await CreditSale.aggregate([
      { $match: creditQuery },
      {
        $group: {
          _id: "$branch",
          branch: { $first: "$branch" },
          totalCreditDue: { $sum: "$amountDue" },
          totalCreditTonnage: { $sum: "$tonnage" }
        }
      }
    ]);

    // ===== COMBINE BY BRANCH =====
    const branchesMap = {};

    normalSales.forEach(s => {
      branchesMap[s.branch] = { branch: s.branch, totalSales: s.totalSales, totalTonnageSold: s.totalTonnageSold, totalCreditDue: 0, totalCreditTonnage: 0 };
    });

    creditSales.forEach(c => {
      if (branchesMap[c.branch]) {
        branchesMap[c.branch].totalCreditDue = c.totalCreditDue;
        branchesMap[c.branch].totalCreditTonnage = c.totalCreditTonnage;
      } else {
        branchesMap[c.branch] = { branch: c.branch, totalSales: 0, totalTonnageSold: 0, totalCreditDue: c.totalCreditDue, totalCreditTonnage: c.totalCreditTonnage };
      }
    });

    const branches = Object.values(branchesMap);

    // ===== GRAND TOTALS =====
    const grandTotalCash = branches.reduce((sum, b) => sum + b.totalSales, 0);
    const grandTotalCredit = branches.reduce((sum, b) => sum + b.totalCreditDue, 0);

    res.status(200).json({
      branches,
      grandTotalCash,
      grandTotalCredit
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};