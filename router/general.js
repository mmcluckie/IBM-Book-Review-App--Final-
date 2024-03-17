const express = require('express');
const books = require('./books_db.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

// Task 6: Registering a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  // Check if username already exists
  if (users.hasOwnProperty(username)) {
    return res
      .status(409)
      .json({ message: 'Username already exists. Choose a different one.' });
  }

  // Add the new user
  users.push({ username, password });

  // Log and respond
  console.log(`User registered: ${username} with ${password}`);
  return res.status(201).json({ message: 'User registered successfully.' });
});

// Task 1: Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: 'Book not found!' });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const bookArray = Object.values(books);
  const authorFilter = bookArray.filter((book) => book.author === author);

  if (authorFilter.length > 0) {
    return res.status(200).json(authorFilter);
  } else {
    return res
      .status(404)
      .json({ message: 'No books found for the specific author.' });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const bookArray = Object.values(books);
  const titleFilter = bookArray.filter((book) => book.title === title);

  if (titleFilter.length > 0) {
    return res.status(200).json(titleFilter);
  } else {
    return res
      .status(404)
      .json({ message: 'No books found for the specific title.' });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res
      .status(404)
      .json({ message: 'No review found for the specific book ISBN.' });
  }
});

module.exports.general = public_users;
