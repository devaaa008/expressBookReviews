const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const {
  getCustomerCollection,
  getBooksCollection,
} = require("../model/database.js");

let users = [
  { username: "bob", password: "1234" },
  { username: "marley", password: "12345" },
];
const secret = "secretkeyforauthentication";
const isValid = async (username) => {
  const collection = await getCustomerCollection();
  const users = await collection.find({ username }).toArray();
  console.log(users, Boolean(users.length));
  return Boolean(users.length);
};

const authenticatedUser = async (username, password) => {
  const collection = await getCustomerCollection();

  const users = await collection.find({ username, password }).toArray();

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

  req.session.username = null;
  return res.status(403).json({ message: "Login failed" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  let username = req.session.username;
  if (!req.query.review) {
    return res
      .status(400)
      .json({ error: "Review parameter is missing or invalid." });
  }
  const newReview = { reviewer: username, comment: req.query.review };
  const collection = await getBooksCollection();

  const result = await collection.updateOne(
    { book_id: +req.params.isbn },
    { $push: { reviews: newReview } }
  );

  if (result.modifiedCount === 1) {
    return res.status(200).json({
      message: "Review Updated successfully for ISBN: " + +req.params.isbn,
    });
  } else {
    throw new Error("Failed to update review");
  }
});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
  let username = req.session.username;

  const collection = await getBooksCollection();

  const result = await collection.updateOne(
    { book_id: +req.params.isbn },
    { $pull: { reviews: { reviewer: username } } }
  );

  if (result.modifiedCount === 1) {
    return res.status(200).json({
      message: "Review Deleted successfully for ISBN: " + +req.params.isbn,
    });
  } else {
    console.log("Failed to delete review");
    res.status(400);
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
