const express = require("express");
const router = express.Router();
const file = require("../models/Files");
const upload = require("../middleware/fileUpload");
const authenticateToken = require("../middleware/authenticateToken");

router.post(
  "/add",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    const data = new file({
      name: req.file.originalname,
      assignedTo: req.body.assignedTo,
      paymentType: req.body.paymentType,
      avance: req.body.avance,
      totalPrice: req.body.totalPrice,
      company: req.body.company,
      destination: req.body.destination,
      post: req.body.post,
    });
    try {
      const savedFile = await data.save();
      res.status(200).send(savedFile);
    } catch (err) {
      res.status(400).send({ err });
    }
  }
);

router.get("/getall", authenticateToken, async (req, res) => {
  try {
    const files = await file
      .find({})
      .populate("assignedTo", "firstName lastName cin");
    res.status(200).send(files);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

router.get("/:Id", authenticateToken, async (req, res) => {
  try {
    const data = await file
      .findById(req.params.Id)
      .populate("assignedTo", "firstName lastName cin");
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("File not found");
  }
});

router.delete("/delete/:fileId", authenticateToken, async (req, res) => {
  try {
    const removedFile = await file.deleteOne({
      _id: req.params.fileId,
    });
    res.status(200).send(removedFile);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

router.patch("/:fileId", authenticateToken, async (req, res) => {
  try {
    const updatedFile = await file.updateOne(
      { _id: req.params.fileId },
      {
        $set: {
          name: req.body.name,
          assignedTo: req.body.assignedTo,
          paymentType: req.body.paymentType,
          avance: req.body.avance,
          totalPrice: req.body.totalPrice,
          company: req.body.company,
          destination: req.body.destination,
          post: req.body.post,
        },
      }
    );
    res.status(200).send("updated :" + updatedFile.acknowledged);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
