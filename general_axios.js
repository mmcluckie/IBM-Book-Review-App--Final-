const express = require('express');
const axios = require('axios');
const books = require('./books_db.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

// Function to fetch books using Axios and Promises
const fetchBooks = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        'https://afiqrazak380-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/'
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Task 10: Get the list of books available in the shop using Promise callbacks or async-await with Axios
public_users.get('/', async (req, res) => {
  try {
    const books = await fetchBooks();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(
      `mmcluckie.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/isbn/${isbn}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'Book not found!' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Task 12: Get book details based on Author using Promise callbacks or async-await with Axios
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(
      `http://mmcluckie-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/author/${author}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res
        .status(404)
        .json({ message: 'No books found for the specific author.' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Task 13: Get book details based on Title using Promise callbacks or async-await with Axios
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(
      `http://mmcluckie-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/title/${title}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res
        .status(404)
        .json({ message: 'No books found for the specific title.' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports.general = public_users;
