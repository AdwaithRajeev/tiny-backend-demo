const express = require("express");
const mysql = require("mysql2")
const path = require("path");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "loginpage",
  port :3306
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed");
    console.log(err);
    return;
  }
  console.log("MySQL connected");
});

const app = express();

app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
   res.sendFile(path.join(__dirname,"login.html"));
});
app.get("/register.html",(req,res)=>{
    res.sendFile(path.join(__dirname,"register.html"))
});
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

  db.query(sql, [username, password], (err) => {
    if (err) {
      console.log(err);
      return res.send("Registration failed");
    }
    res.redirect("/home");

  });
});
app.get("/home",(req,res)=>{
  res.sendFile(path.join(__dirname,"home.html"));
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Database error");
    }

    // ❌ User not found
    if (results.length === 0) {
      return res.send("User not found");
    }

    const user = results[0];

    // ❌ Password mismatch
    if (user.password !== password) {
      return res.send("Wrong password");
    }

    // ✅ Login success
    res.redirect("/home");
  });
});




app.listen  (3000, () => {
    console.log("backend ready")
});