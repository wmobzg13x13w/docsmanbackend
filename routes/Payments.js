const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/totalamount", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const allPayments = await Payment.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    let totalAmount = 0;
    allPayments.forEach((payment) => {
      totalAmount += payment.amount;
    });

    res.status(200).json({ totalAmount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/getall", async (req, res) => {
  try {
    const allPayments = await Payment.find({});
    console.log(allPayments);

    res.status(200).json(allPayments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
