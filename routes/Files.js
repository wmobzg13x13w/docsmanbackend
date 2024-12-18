const express = require("express");
const router = express.Router();
const file = require("../models/Files");
const upload = require("../middleware/fileUpload");
const authenticateToken = require("../middleware/authenticateToken");
const payment = require("../models/Payment");

router.post(
  "/add",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    const {
      name,
      assignedTo,
      totalPrice,
      company,
      destination,
      post,
      payments,
    } = req.body;

    try {
      // Create a new File instance using the file metadata
      const newFile = new file({
        name,
        assignedTo,
        totalPrice,
        company,
        destination,
        post,
      });

      // Save the File to the database
      const savedFile = await newFile.save();

      // If payments are provided, create them and associate with the file
      let savedPayments = [];
      if (payments && payments.length > 0) {
        const paymentPromises = payments.map(async (paymentData) => {
          const { amount, paymentType, date } = paymentData;

          // Create a new Payment instance
          const newPayment = new payment({
            amount,
            paymentType,
            date,
            file: savedFile._id, // Reference to the saved File
          });

          // Save the Payment to the database
          return await newPayment.save();
        });

        // Wait for all payments to be saved
        savedPayments = await Promise.all(paymentPromises);

        // Update the File to include payment references
        await file.findByIdAndUpdate(savedFile._id, {
          $push: {
            payments: { $each: savedPayments.map((payment) => payment._id) },
          },
        });
      }

      // Respond with the created file and its payments
      res.status(201).json({
        message: "File created successfully",
        file: savedFile,
        payments: savedPayments,
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
);

router.get("/totalamount", authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const allFiles = await file.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    let totalAmount = 0;
    allFiles.forEach((file) => {
      totalAmount += file.totalPrice;
    });

    res.status(200).json({ totalAmount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/getall", authenticateToken, async (req, res) => {
  try {
    const files = await file
      .find({})
      .populate("assignedTo", "firstName lastName cin")
      .populate("payments");
    res.status(200).send(files);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

router.get("/:Id", authenticateToken, async (req, res) => {
  try {
    const data = await file
      .findById(req.params.Id)
      .populate("assignedTo", "firstName lastName cin")
      .populate("payments");
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("File not found");
  }
});

router.delete("/delete/:fileId", authenticateToken, async (req, res) => {
  try {
    // Find and delete the file along with its related payments
    const removedFile = await file.findOneAndDelete({ _id: req.params.fileId });

    // Find and delete all payments associated with the deleted file
    await payment.deleteMany({ file: req.params.fileId });

    res.status(200).send(removedFile);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.patch("/:fileId", authenticateToken, async (req, res) => {
  try {
    const updatedFile = await file.findOneAndUpdate(
      { _id: req.params.fileId },
      {
        assignedTo: req.body.assignedTo,
        totalPrice: req.body.totalPrice,
        company: req.body.company,
        destination: req.body.destination,
        post: req.body.post,
      },
      { new: true }
    );

    // Update existing payments if provided
    let updatedPayments = [];
    if (req.body.payments && req.body.payments.length > 0) {
      const paymentPromises = req.body.payments.map(async (paymentData) => {
        let updatedPayment;
        if (paymentData._id) {
          updatedPayment = await payment.findOneAndUpdate(
            { _id: paymentData._id },
            {
              amount: paymentData.amount,
              paymentType: paymentData.paymentType,
              date: paymentData.date,
            },
            { new: true }
          );
        } else {
          const newPayment = new payment({
            amount: paymentData.amount,
            paymentType: paymentData.paymentType,
            date: paymentData.date,
            file: updatedFile._id,
          });
          updatedPayment = await newPayment.save();
        }
        return updatedPayment;
      });

      updatedPayments = await Promise.all(paymentPromises);

      // Update the File to include updated payment references
      await file.findOneAndUpdate(
        { _id: req.params.fileId },
        {
          $set: { payments: updatedPayments.map((payment) => payment._id) },
        }
      );
    }

    res.status(200).send({
      message: "File and payments updated successfully",
      file: updatedFile,
      payments: updatedPayments,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
