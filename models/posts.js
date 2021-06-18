const db= require("../controller/db")

db.query(
    "CREATE TABLE IF NOT EXISTS  posts ( post_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,user_id int default NULL ,title varchar(255) NOT NULL,content text NOT NULL,published tinyint(1) NOT NULL default 0,created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ,updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))",
    (err, result) => {
      if (err) console.log(err)
    }
  );
  
