const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },

  amount: { type: Number, required: true },
  paymentType: {
    type: String,
    required: true,
    enum: ["En Espèces", "Virement", "Chèque"],
    default: "En Espèces",
  },
  date: { type: Date, default: Date.now },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
