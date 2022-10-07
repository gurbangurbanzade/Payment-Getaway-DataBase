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
  "mongodb+srv://abulfaz:ebulfez1995@cluster0.hnqdmkq.mongodb.net/Companies?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

//DB TABLE
const companySchema = new Schema({
  companyName: String,
  description: String,
  price: Number,
});

const Companies = mongoose.model("Company", companySchema);

//GETALL
app.get("/company", (req, res) => {
  Companies.find({}, (err, docs) => {
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

  Companies.findById(id, (err, doc) => {
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
  Companies.findByIdAndDelete(id, (err) => {
    if (!err) res.json({ messagae: "Success!" });
    else res.status(500).json(err);
  });
});

app.post("/company", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  var company = new Companies({
    companyName: req.body.companyName,
    description: req.body.description,
    price: req.body.price,
  });
  company.save();
  res.send("Success!!");
});

app.listen(8000, () => {
  console.log("Server is running!!");
});
