const express = require("express");
const auth = require("../config/auth");
const {
  addBookCtrl,
  allBooksForUsers,
  allBooks,
  availableBooksForUser,
  getBookById,
  getBookUserId,
  removeBook,
  requestBorrow,
  fetchRequestedBooks,
  handleBorrowRequest,
  borrowedBooks,
  handleFine,
  submitFine,
  acceptFine,
  updateBook,
  handleReturn,
} = require("../controllers/libraryCtrl");
const router = express.Router();

router.post("/add-book", auth, addBookCtrl);

router.get("/all-books-user", allBooksForUsers);

router.get("/all-books", allBooks);

router.get("/availabe-books", availableBooksForUser);

router.get("/requested-books", auth, fetchRequestedBooks);

router.post("/request-borrow", auth, requestBorrow);

router.put("/handle-borrow-request/:bookId", auth, handleBorrowRequest);

router.get("/all-book-user/:id", getBookUserId);

router.get("/all-book/:id", auth, getBookById);

router.delete("/delete-book/:id", auth, removeBook);

router.put("/all-book/:id", auth, updateBook);

router.get("/borrowed-books", auth, borrowedBooks);

router.patch("/update-fine", auth, handleFine);

router.patch("/accept-fine", auth, acceptFine);

router.patch("/submit-fine", auth, submitFine);

router.put("/return-books", auth, handleReturn);

module.exports = router;
