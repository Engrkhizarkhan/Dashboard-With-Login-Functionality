const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session
app.use(
  session({
    secret: "your_secret_key", // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);

// Dummy User Credentials
const USERNAME = "khizar";
const PASSWORD = "1234";

// Serve static files
app.set("view engine", "ejs");

// Middleware to check if user is logged in
function checkAuth(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// Login Page Route
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle Login POST Request
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    req.session.user = username; // Store session
    res.redirect("/dashboard");
  } else {
    res.send("Invalid Credentials. <a href='/login'>Try again</a>");
  }
});

// Protected Dashboard Route
app.get("/dashboard", checkAuth, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
