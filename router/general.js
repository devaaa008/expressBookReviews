const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const {
  getBooksCollection,
  getCustomerCollection,
} = require("../model/database.js");

public_users.post("/customer/register", async (req, res) => {
  let user = req.body;
  if (!("username" in user && "password" in user)) {
    return res
      .status(400)
      .json({ message: "username &/ password are not provided" });
  } else if (await isValid(user.username)) {
    return res.status(200).json({ message: "User already exists" });
  }

  try {
    const collection = await getCustomerCollection();

    collection.insertOne({ username: user.username, password: user.password });
  } catch (e) {
    throw new Error("Error while inserting document");
  }
  return res.status(200).json({ message: "user registered successfully" });
});

// Get the book list available in the shop
public_users.get("/books", async function (req, res) {
  const collection = await getBooksCollection();

  const books = await collection.find({}).toArray();

  return res.json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const collection = await getBooksCollection();

  const books = await collection.find({ book_id: +req.params.isbn }).toArray();

  return res.json(books);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const collection = await getBooksCollection();

  const books = await collection.find({ author: req.params.author }).toArray();

  return res.json(books);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const collection = await getBooksCollection();

  const books = await collection.find({ title: req.params.title }).toArray();

  return res.json(books);
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const collection = await getBooksCollection();

  const books = await collection.find({ book_id: +req.params.isbn }).toArray();
  console.log(books[0].reviews);
  return res.json(books.map((book) => book.reviews));
});

module.exports.general = public_users;
