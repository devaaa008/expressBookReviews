const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "bob", password: "1234" },
  { username: "marley", password: "12345" },
];
const secret = "secretkeyforauthentication";
const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.find(user=>user.username==username)
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return (
    users.find(
      (user) => user.username == username && user.password == password
    ) != null
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username &/ password are not provided" });
  }
  if (authenticatedUser(username, password)) {
    let resp = jwt.sign({ username, password }, secret, { expiresIn: "1h" });
    req.session.username = username;
    return res.status(200).json({ message: "Login successful" });
  }
  req.session.username=null
  return res.status(403).json({ message: "Login failed" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.session.username;
  let isbn = req.params.isbn;
  let reviewNote = req.query.review;
  books[isbn].reviews[username] = reviewNote;
  return res
    .status(200)
    .json({ message: "Review Updated successfully for ISBN: " + isbn });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.username;
  delete books[isbn].reviews[username];
  return res
    .status(200)
    .json({ message: "Review deleted successfully for ISBN: " + isbn });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;