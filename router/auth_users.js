const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./books_db.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userwithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userwithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Check if user is authenticated
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: 'Error loggin in' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 }
    );

    // Update the session with authorization information
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('User succesfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Loggin. Check username and password!' });
  }
});

// Add or modify a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.user.username;

  // Find the book by ISBN
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Initialize book.reviews as an empty arry if it doesn't exist
  if (!Array.isArray(book.reviews)) {
    book.reviews = [];
  }

  // Check if the user already has a review for the book
  const existingReviewIndex = book.reviews.findIndex(
    (existingReview) => existingReview.username === username
  );

  if (existingReviewIndex !== -1) {
    // Modify the existing review
    book.reviews[existingReviewIndex].review = review;
  } else {
    // Add a new review
    book.reviews.push({ username, review });
  }

  return res
    .status(200)
    .json({ message: 'Review added or modified successfully' });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  // Find the book by ISBN
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Filter and delete the reviews based on the session username
  book.reviews = book.reviews.filter(
    (existingReview) => existingReview.username !== username
  );

  return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
