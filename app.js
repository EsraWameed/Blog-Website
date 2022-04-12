//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt= require("mongoose-encryption");

const homeStartingContent = "Welcome to my tech portfolio. This is where I will be taking you with me on my journey of becoming a better web-developer everyday. stay tuned and take a look around my website!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
console.log(process.env.API_KEY);

let posts= [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//to use mongoose. out DB will be called userDB
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser: true});
//set up new user dB. create schema
//pbject created from mongoose schema class.
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//use convenient method to define a secret
//add plugin onto Schema and pass in secret as js object
//add plugin to schema before adding new mongoose model
//this is because mongoose schema is one of the parameters to create new mongoose model (user)
userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});

//use user schema to set up new user model. our collection called "User"
const User = new mongoose.model("User", userSchema);
//we can now start creating users and adding it to userDB. we create users when client goes to register page and type in their email and password.



app.get("/", function(req,res){
res.render("home", {
  startingContent: homeStartingContent,
  posts:posts
});
});

app.get("/posts", function(req,res){
res.render("posts", {
  startingContent: homeStartingContent,
  posts:posts
});
});

app.get("/about", function(req,res){
res.render("about", {theAboutt: aboutContent});
});

app.get("/contact", function(req,res){
res.render("contact", {theContact: contactContent});
});

app.get("/projects", function(req,res){
res.render("projects");
});

app.get("/compose", function(req,res){
res.render("compose");
});

//for the security project

app.get("/anonymous", function(req,res){
res.render("anonymous");
});

app.get("/login", function(req,res){
res.render("login");
});

app.get("/register", function(req,res){
res.render("register");
});

app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
//mongoose will encrypt upon save
newUser.save(function(err){
  if(err){
    console.log(err);
  }else{
    res.render("secrets");
  }
});
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  //want to check those against our data base
//look through collection of users
//encryption decrypted here upon find
  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets");
        }
      }
    }
  });
});

//for the security project


app.post("/compose",function(req,res){
    const post ={
      title: req.body.postTitle,
      content:req.body.posTing
    };
 posts.push(post);
 console.log(posts);
 res.redirect("/posts");
});

app.get("/posts/:name", function(req,res){
const requestedTitle=_.lowerCase(req.params.name);
posts.forEach(function(post){
  const storedTitle = _.lowerCase(post.title);

  if(storedTitle===requestedTitle){
    console.log("yep");
    res.render("post",{title:post.title, content:post.content});
  };
});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
