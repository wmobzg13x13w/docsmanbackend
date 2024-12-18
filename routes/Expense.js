const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/add", async (req, res) => {
  try {
    const { title, amount, paymentType, date } = req.body;

    const expense = new Expense({
      title,
      amount,
      paymentType,
      date,
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.get("/getall", async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.status(200).send(expenses);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

router.get("/total", authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const expenses = await Expense.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }, // Filter by date
    });

    let totalAmount = 0;
    expenses.forEach((expense) => {
      totalAmount += expense.amount;
    });

    res.status(200).send({ totalAmount });
  } catch (err) {
    res.status(400).send({ message: err.message }); // Send err.message for better error handling
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
});

// Get all expenses (GET)

// Update an expense by ID (PUT)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, paymentType, date } = req.body;

    // Find the expense by ID and update it
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, paymentType, date },
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

// Delete an expense by ID (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the expense by ID and delete it
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
