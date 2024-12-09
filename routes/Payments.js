const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/totalamount", async (req, res) => {
  try {
    // Find all payments
    const allPayments = await Payment.find({});

    // Calculate the total amount of payments
    let totalAmount = 0;
    allPayments.forEach((payment) => {
      totalAmount += payment.amount;
    });

    res.status(200).json({ totalAmount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
