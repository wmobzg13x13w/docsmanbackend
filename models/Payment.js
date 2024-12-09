const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paymentType: {
    type: String,
    required: true,
    enum: ["En Espèces", "Virement", "Chèque"],
    default: "En Espèces",
  },
  date: { type: Date, default: Date.now },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
