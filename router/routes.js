const express = require("express");
const router = express.Router();

const db = require("../controller/db");
const users = require("../models/users");
const posts = require("../models/posts");
var msg = "";

router.get("/registration", (req, res) => {
  res.render("challenges/registration", { errormessage: msg });
});

router.post("/register_auth", (req, res) => {
  msg = "";
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  if (email && password && username) {
    db.query(
      "SELECT * FROM users WHERE email= ? ",
      [email],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          res.render("challenges/error");
        } else {
          if (results.length > 0) {
            msg = "User already Exists ";
            res.redirect("registration");
          } else {
            db.query(
              "insert into users (email,password,username) values (?,?,?) ",
              [email, password, username],
              (error, results, fields) => {
                if (error) res.render("challenges/error");
                else {
                  msg = "User Successfully Registered";
                  res.redirect("registration");
                }
              }
            );
          }
        }
      }
    );
  } else {
    msg = "Enter valid Entries";
    res.redirect("registration");
  }
});

router.get("/login", (req, res) => {
  res.render("challenges/login", { errormessage: msg });
});

router.post("/login_auth", (req, res) => {
  msg = "";
  var email = req.body.email;
  var password = req.body.password;
  if (email && password) {
    db.query(
      "SELECT * FROM users WHERE email= ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.render("challenges/error");
        } else {
          if (results.length > 0) {
            req.session.loggedIn = true;
            req.session.email = results[0].email;
            res.redirect("/");
          } else {
            msg = "Enter valid Entries";
            res.redirect("login");
          }
        }
      }
    );
  } else {
    msg = "Enter valid Entries";
    res.redirect("login");
  }
});

router.get("/logout", function (req, res, next) {
  req.session.loggedIn = false;
  msg = "Logout successful";
  res.redirect("login");
});

router.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.render("layout/main", { errormessage: msg });
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.get("/add", (req, res) => {
  msg = "";
  if (req.session.loggedIn) {
    res.render("challenges/add");
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.post("/add_new_post", (req, res) => {
  msg = "";
  if (req.session.loggedIn) {
    var title = req.body.title;
    var content = req.body.content;
    var publish = req.body.publish;
    db.query(
      "select id from users where email = ?  ",
      [req.session.email],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          res.render("challenges/error");
        } else {
          var user_id = results[0].id;
          var published;
          if (publish == "true") published = 1;
          else published = 0;
          db.query(
            "insert into posts (title,content,user_id,published) values (?,?,?,?)  ",
            [title, content, user_id, published],
            (error, results, fields) => {
              if (error) {
                console.log(error);
                res.render("challenges/error");
              } else {
                msg = "Blog Created Successfully";
                res.redirect("/");
              }
            }
          );
        }
      }
    );
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.get("/mine", (req, res) => {
  msg = "";
  if (req.session.loggedIn) {
    db.query(
      "select title,post_id from posts join users on posts.user_id = users.id where email = ? order by updated_at desc ",
      [req.session.email],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.render("challenges/error");
        } else {
          res.render("challenges/myblog", { data: results });
        }
      }
    );
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.get("/view", (req, res) => {
  msg = "";
  if (req.session.loggedIn) {
    db.query(
      "select title,post_id from posts join users on posts.user_id = users.id where email <> ? and published = 1 order by updated_at desc ",
      [req.session.email],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.render("challenges/error");
        } else {
          res.render("challenges/otherblog", { data: results });
        }
      }
    );
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.get("/find/:post_id", (req, res) => {
  msg = "";
  if (req.session.loggedIn) {
    db.query(
      "select * from posts join users on posts.user_id=users.id where post_id = ? ",
      [req.params.post_id],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.render("challenges/error");
        } else {
          res.render("challenges/show", {
            title: results[0].title,
            created_at: results[0].created_at,
            content: results[0].content,
            updated_at: results[0].updated_at,
            username: results[0].username,
          });
        }
      }
    );
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.get("/edit/:post_id", (req, res) => {
  msg = "";
  if (req.session.loggedIn) {
    db.query(
      "select * from posts join users on posts.user_id=users.id where email=? and post_id = ? ",
      [req.session.email, req.params.post_id],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.render("challenges/error");
        } else {
          res.render("challenges/edit", {
            title: results[0].title,
            content: results[0].content,
            id: req.params.post_id,
          });
        }
      }
    );
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.get("/delete/:post_id", (req, res) => {
  msg = "";
  if (req.session.loggedIn) {
    db.query(
      "delete from posts where post_id = ? ",
      [req.params.post_id],
      function (err, results, fields) {
        if (err) {
          console.log(err);
          res.render("challenges/error");
        } else {
          res.redirect("/mine");
        }
      }
    );
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.post("/edit/edit_post", (req, res) => {
  msg = "";
  var title = req.body.title;
  var content = req.body.content;
  var id = req.body.id;
  var publish = req.body.publish;
  if (req.session.loggedIn) {
    db.query(
      "select * from posts join users on posts.user_id = users.id where email =? and post_id =? ",
      [req.session.email, id],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          res.render("challenges/error");
        } else {
          var published;
          if (publish == "true") published = 1;
          else published = 0;
          var user_id = results[0].user_id;

          db.query(
            "update posts  SET Updated_at=CURRENT_TIMESTAMP() ,content =? ,title =?,published=? where post_id = ? and user_id=? ",
            [content, title, published, id, user_id],
            (error, results, fields) => {
              if (error) {
                console.log(error);
                res.render("challenges/error");
              } else {
                msg = "Blog updated Successfully";
                res.redirect("/");
              }
            }
          );
        }
      }
    );
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.get("/contact", (req, res) => {
  msg = "";
  if (req.session.loggedIn) {
    res.render("challenges/contact");
  } else {
    msg = "You have to login first";
    res.redirect("login");
  }
});

router.get("/*", function (req, res) {
  res.render("challenges/error");
});

module.exports = router;
