const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    company: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }], // Reference to Payment model
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
