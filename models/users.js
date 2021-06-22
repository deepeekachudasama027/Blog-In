var db = require("../controller/db");

db.query(
  "CREATE TABLE IF NOT EXISTS users (user_name varchar(255) NOT NULL,ID int AUTO_INCREMENT PRIMARY KEY  NOT NULL, email varchar(255) NOT NULL Unique, password varchar(255) NOT NULL)",
  (err, result) => {
    if (err) console.log(err);
  }
);