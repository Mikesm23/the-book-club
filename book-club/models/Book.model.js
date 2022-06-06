const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  bookCover: {
    type: String,
    //required: true
  },
  plot: {
    type: String,
    required: true,
  },
  isbn: {
    type: Number,
    required: true,
  }
});

const Book = model("Book", bookSchema);

module.exports = Book;