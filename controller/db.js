const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
});

db.connect(function (err) {
  if (err) {
    console.error(err);
  }
});

db.query("CREATE DATABASE IF NOT EXISTS Blogpost", function (err, result) {
  if (err) throw err;
});

db.query("use Blogpost", function (err, result) {
  if (err) throw err;
});

module.exports = db;

