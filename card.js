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
  "mongodb+srv://abulfaz:ebulfez1995@cluster0.hnqdmkq.mongodb.net/Card?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

//DB TABLE
const cardSchema = new Schema({
  email: String,
  cardDetail: Number,
  cardName: String,
});

const Card = mongoose.model("Card", cardSchema);

//GETALL
app.get("/card", (req, res) => {
    Card.find({}, (err, docs) => {
    if (!err) {
      res.json(docs);
    } else {
      res.status(500).json(err);
    }
  });
});

//GET id
app.get("/card/:id", (req, res) => {
  let id = req.params.id;

  Card.findById(id, (err, doc) => {
    if (!err) {
      if (doc) res.json(doc);
      else res.status(404).json({ message: "Not found!" });
    } else {
      res.status(500).json(err);
    }
  });
});
// Delete
app.delete("/card/:id", (req, res) => {
  let id = req.params.id;
  Card.findByIdAndDelete(id, (err) => {
    if (!err) res.json({ messagae: "Success!" });
    else res.status(500).json(err);
  });
});

app.post("/card", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  var card = new Card({
    email: req.body.email,
    cardDetail: req.body.cardDetail,
    cardName: req.body.cardName,
  });
  card.save();
  res.send("Success!!");
});

app.listen(8070, () => {
  console.log("Server is running!!");
});
