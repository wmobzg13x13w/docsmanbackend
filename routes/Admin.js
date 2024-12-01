const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

const { body, validationResult } = require("express-validator");

const authenticateToken = require("../middleware/authenticateToken");

//Register
router.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("email must be a valid email ")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength(8)
      .withMessage("password length short , min 8 char required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).send(errors);
    }
    let admin = await Admin.findOne({ email: req.body.email });

    if (admin) {
      return res.status(401).send("email already exist ");
    }
    admin = new Admin({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    try {
      const savedadmin = await admin.save();
      res.status(200).send("registered successfully ");
    } catch (err) {
      res.status(400).send({ err });
    }
  }
);

router.post(
  "/",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("email must be a valid email ")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength(8)
      .withMessage("password length short , min 8 char required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors);
    }

    let admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(404).send("invalid email");
    }
    const checkPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!checkPassword) {
      return res.status(404).send("invalid email or password");
    }
    const token = admin.generateTokens();
    return res.status(200).json({ admin, token });
  }
);

module.exports = router;
