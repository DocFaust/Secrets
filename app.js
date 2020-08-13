//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const md5 = require("md5");
const bcrypt = require('bcryptjs');
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  const user = new User({
    email: email,
    password: md5(password),
  });

  user.save((err) => {
    if (!err) {
      res.render("secrets");
    } else {
      res.render(err);
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = md5(req.body.password);
  User.findOne(
    {
      email: email,
      password: password,
    },
    (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          } else {
              res.send("Meep: " +password);
          }
        }
      }
    }
  );
});
app.listen(port, () => {
  console.log("Server started on port " + port);
});
