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
  },
  plot: {
    type: String,
    required: true,
  },
  isbn: {
    type: Number,
    required: true,
  },
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
  
});

const Book = model("Book", bookSchema);

module.exports = Book;