const router = require("express").Router();
const session = require("express-session")
const mongo = require("connect-mongo")

/* GET login page */
router.get("/login", (req, res) => {
  res.render("auth/login");
});

/* GET signup page */
router.get("/signup", (req, res) => {
    res.render("auth/signup");
  });

/* GET profile page */
router.get("/profile", (req, res) => {
    res.render("auth/profile");
  });

/* GET create-book page */
router.get("/create-book", (req, res) => {
    res.render("auth/create-book");
  });

/* GET book details page */
router.get("/book-details", (req, res) => {
  res.render("auth/book-details");
});

/* GET book list page */
router.get("/books-list", (req, res) => {
  res.render("auth/books-list");
});

module.exports = router;
