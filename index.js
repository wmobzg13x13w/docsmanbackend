const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: [
      "http://localhost:3000",
      "https://earnest-starlight-947cce.netlify.app",
    ],
  })
);
const Admin = require("./routes/Admin");
const Employee = require("./routes/Employee");
const Files = require("./routes/Files");
const Expense = require("./routes/Expense");
const Payment = require("./routes/Payments");

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() =>
    app.listen(port, () => console.log("app working on port " + port + "..."))
  )
  .then(() => console.log("connected to db"))
  .catch((e) => console.log("check ur database server :" + e));

app.use("/admin", Admin);
app.use("/employee", Employee);
app.use("/files", Files);
app.use("/expense", Expense);
app.use("/payment", Payment);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
