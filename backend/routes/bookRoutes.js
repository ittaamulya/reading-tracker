const express = require("express");
const router = express.Router();
const {
  addBook,
  getBooks,
  getBookById,
  updateBookProgress,
  updateRating,
  deleteBook
} = require("../controllers/bookController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getBooks);
router.get("/:id", verifyToken, getBookById);
router.post("/", verifyToken, addBook);
router.put("/:id", verifyToken, updateBookProgress);
router.put("/rating/:id", verifyToken, updateRating);
router.delete("/:id", verifyToken, deleteBook);

module.exports = router;
