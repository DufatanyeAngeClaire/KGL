// const Procurement = require("../models/Procurement")
const Sale = require("../models/Sale")
const CreditSale = require("../models/CreditSale")

const getDashboardData = async (req, res) => {
  try {
    const procurement = await Procurement.find() 
    const sales = await Sale.find()
    const creditSales = await CreditSale.find()

    const transactions = [
      ...procurement.map(p => ({
        _id: p._id,
        type: "Procurement",
        produceName: p.item,
        branch: p.branch || "-",
        quantity: p.quantity,
        amount: p.amount,
        person: p.supplierName || "-", 
        date: p.date
      })),
      ...sales.map(s => ({
        _id: s._id,
        type: "Sale",
        produceName: s.produceName,
        branch: s.branch,
        quantity: s.tonnage,
        amount: s.amountPaid,
        person: s.buyerName,
        date: s.date
      })),
      ...creditSales.map(c => ({
        _id: c._id,
        type: "Credit Sale",
        produceName: c.produceName,
        branch: c.branch,
        quantity: c.tonnage,
        amount: c.amountDue,
        person: c.buyerName,
        date: c.dispatchDate
      }))
    ]

    // Sort latest first
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date))

    const summary = [
      { title: "Total Procurement", value: procurement.length },
      { title: "Total Sales", value: sales.length },
      { title: "Total Credit Sales", value: creditSales.length }
    ]

    res.json({ transactions, summary })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { getDashboardData }