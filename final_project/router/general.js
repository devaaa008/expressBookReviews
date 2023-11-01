const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  let user = req.body;
  if (!("username" in user && "password" in user)) {
    return res
      .status(400)
      .json({ message: "username &/ password are not provided" });
  } else if (isValid(user.username)) {
    return res.status(200).json({ message: "User already exists" });
  }
  users.push(user);
  return res.status(200).json({ message: "user registered successfully" });
});

let getBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};
// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  let books = await getBooks();
  return res.json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  getBooks().then((books) => {
    return res.json(books[req.params.isbn]);
  });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let authorBooks = [];
  getBooks().then((books) => {
    for (let obj in books) {
      if (books[obj].author == req.params.author) {
        authorBooks.push(books[obj]);
      }
    }
    return res.status(200).json({ booksbyauthor: authorBooks });
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let titleBasedBooks = [];
  getBooks().then((books) => {
    for (let obj in books) {
      if (books[obj].title == req.params.title) {
        titleBasedBooks.push(books[obj]);
      }
    }
    return res.status(200).json({ booksbytitle: titleBasedBooks });
  });
});
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;