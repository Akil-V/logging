//jshint esversion:6
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//Connect database using mongoose
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

//Using new schema
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});



//We are going to encrypt only the password
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});


//Creating the model
const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res) {
  res.render("home");
});

app.get("/login",function(req,res) {
  res.render("login");
});

app.get("/register",function(req,res) {
  res.render("register");
});

//making a newuser to save it in the DB.
app.post("/register",function(req,res) {
  // creating newUser
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  // Saving the newUser
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    }else {
      res.render("secrets");
    }

  });
});

app.post("/login", function(req,res) {
  const username = req.body.username;
  const password = req.body.password;

  //To check and login whether user is already registered for a successfull login
  User.findOne({email: username}, function(err,foundUser){
    if (err) {
      console.log(err);
    }else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
})












const PORT = process.env.PORT || 3000
app.listen(PORT,function() {
  console.log('Server started.Go to localhost:3000');
})
