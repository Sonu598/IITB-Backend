const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["AVAILABLE", "BORROWED"],
    default: "AVAILABLE",
  },
});

const BookModel = mongoose.model("Book", bookSchema);

module.exports = { BookModel };
