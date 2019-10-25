//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(express.static("assets"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/bookstorecustomerDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const orderSchema = new mongoose.Schema({
  customerName: String,
  bookname: String,
  quantity: Number,
});

const Order = mongoose.model("Order", orderSchema);

const customerSchema = new mongoose.Schema({
  name: String,
  mobileNumber: Number,
  email: String,
  password: String,
  address: String,
});

const Customer = mongoose.model("Customer", customerSchema);



app.get("/", function(req, res) {
  res.render("home");
});

app.get("/romance", function(req, res) {
  res.render("romance");
});

app.get("/fiction", function(req, res) {
  res.render("fiction");
});

app.get("/adventure", function(req, res) {
  res.render("adventure");
});

app.get("/biography", function(req, res) {
  res.render("biography");
});

app.get("/:book", function(req, res) {
  const buybook = req.params.book;
  res.render(buybook);
});

app.get("/signup", function(req, res) {
  res.render("signup");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/reviews", function(req, res){
  res.render("reviews");
})



app.post("/register", function(req, res) {
  const name = req.body.username;
  const mobileNumber = req.body.mobile;
  const email = req.body.email;
  const password = req.body.password;
  const address = req.body.address;

  const customer = new Customer({
    name: name,
    mobileNumber: mobileNumber,
    email: email,
    password: password,
    address: address,

  });

  if (name === "" || mobileNumber === null || email === "" || password === "" || address === "") {
    res.render("failure");
  } else {
    customer.save(function(err) {
      if (!err) {
        res.redirect("/login");
      }
    });
  }


});

app.post("/login", function(req, res) {
  const name = req.body.username;
  const password = req.body.password;


  Customer.findOne({
    name: name
  }, function(err, customer) {
    if (err) {
      console.log(err);
    } else {
      if (customer) {
        if (customer.password === password) {


          res.render("order");
        } else {
          res.render("loginFailure");
        }
      } else {
        res.render("loginFailure");
      }
    }

  });
});

app.post("/", function(req,res){
  const customerName = req.body.name;
  const bookname = req.body.bookname;
  const quantity = req.body.quantity;

  const order = new Order({
    customerName: customerName,
    bookname: bookname,
    quantity: quantity
  });

  if(customerName === "" || bookname === "" || quantity === null){
    res.render("orderFailed");
  }else{
    order.save(function(err){
      if(!err){
        res.render("orderPlaced");
      }
    });
  }


});









app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
