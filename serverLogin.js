// Start
const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const app = express();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://gurban:300793mm@cluster0.qob0oxl.mongodb.net/company?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

//DB TABLE
const companySchema = new Schema({
  companyName: String,
  email: String,
  fullName: String,
  password: String,
  confirmPassword: String,
});

const Company = mongoose.model("Company", companySchema);

//GETALL
app.get("/company", (req, res) => {
  Company.find({}, (err, docs) => {
    if (!err) {
      res.json(docs);
    } else {
      res.status(500).json(err);
    }
  });
});

//GET id
app.get("/company/:id", (req, res) => {
  let id = req.params.id;

  Company.findById(id, (err, doc) => {
    if (!err) {
      if (doc) res.json(doc);
      else res.status(404).json({ message: "Not found!" });
    } else {
      res.status(500).json(err);
    }
  });
});
// Delete
app.delete("/company/:id", (req, res) => {
  let id = req.params.id;
  Company.findByIdAndDelete(id, (err) => {
    if (!err) res.json({ messagae: "Success!" });
    else res.status(500).json(err);
  });
});

//Post
app.post("/company", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  var company = new Company({
    companyName: req.body.companyName,
    email: req.body.email,
    fullName: req.body.fullName,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    status: true,
  });
  company.save();
  res.send("Success!!");
});

//Login Post
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  Company.findOne(
    { email: email, password: password },
    function (err, company) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      if (!company) {
        return res.status(404).send("tapilmadi");
      }
      if (company) {
        console.log(company.id);
        return res.redirect(
          `http://localhost:3000/admin/dashboard/${company.id}`
        );
      }
    }
  );
});

app.listen(8080, () => {
  console.log("Server is running!!");
});
