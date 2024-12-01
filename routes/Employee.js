const express = require("express");
const router = express.Router();
const employee = require("../models/Employee");

const authenticateToken = require("../middleware/authenticateToken");

router.post("/add", authenticateToken, async (req, res) => {
  const data = new employee({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    cin: req.body.cin,
    email: req.body.email,
    phone: req.body.phone,
  });
  try {
    const savedEmployee = await data.save();
    res.status(200).send(savedEmployee);
  } catch (err) {
    res.status(400).send({ err });
  }
});

router.get("/getall", authenticateToken, async (req, res) => {
  try {
    const employees = await employee.find({});
    res.status(200).send(employees);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

router.get("/:empId", authenticateToken, async (req, res) => {
  try {
    const data = await employee.findById(req.params.empId);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send("Employee not found");
  }
});

router.delete("/delete/:empId", authenticateToken, async (req, res) => {
  try {
    const removedEmployee = await employee.deleteOne({
      _id: req.params.empId,
    });
    res.status(200).send(removedEmployee);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

router.patch("/:empId", authenticateToken, async (req, res) => {
  try {
    const updatedEmployee = await employee.updateOne(
      { _id: req.params.empId },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          cin: req.body.cin,
          email: req.body.email,
          phone: req.body.phone,
        },
      }
    );
    res.status(200).send("updated :" + updatedEmployee.acknowledged);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
