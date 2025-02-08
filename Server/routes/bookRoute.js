const express = require("express");
const bookRouter = express.Router();
const { BookModel } = require("../models/booksmodel");
const { authenticate } = require("../middleware/auth");

bookRouter.post("/books", authenticate("LIBRARIAN"), async (req, res) => {
  const book = new BookModel(req.body);
  await book.save();
  res.status(201).json({ message: "Book added" });
});

bookRouter.put(
  "/books/:id/borrow",
  authenticate("MEMBER"),
  async (req, res) => {
    const book = await BookModel.findById(req.params.id);
    if (!book || book.status === "BORROWED") {
      return res.status(400).json({ message: "Book not available" });
    }
    book.status = "BORROWED";
    await book.save();
    res.json({ message: "Book borrowed" });
  }
);

bookRouter.put(
  "/books/:id/return",
  authenticate("MEMBER"),
  async (req, res) => {
    const book = await BookModel.findById(req.params.id);
    if (!book || book.status === "AVAILABLE") {
      return res.status(400).json({ message: "Book is already available" });
    }
    book.status = "AVAILABLE";
    await book.save();
    res.json({ message: "Book returned" });
  }
);

bookRouter.get("/books", async (req, res) => {
  const books = await BookModel.find();
  res.json(books);
});

module.exports = { bookRouter };
