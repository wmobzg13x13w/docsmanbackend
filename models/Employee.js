const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cin: { type: String, required: true },

    email: {
      type: String,
      unique: true,
      required: false,
      minlength: 10,
      maxlength: 255,
    },
    phone: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
