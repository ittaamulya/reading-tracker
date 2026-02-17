const pool = require("../config/db");

/* =========================
   ADD BOOK
========================= */
exports.addBook = async (req, res) => {
  try {
    const userId = req.user.id;

    let {
      title,
      author,
      total_pages,
      pages_completed,
      target_date,
      genre,
      review,
      rating,
      description
    } = req.body;

    total_pages = Number(total_pages);
    pages_completed = Number(pages_completed || 0);
    rating = Number(rating || 0);

    if (!title || !author || total_pages <= 0) {
      return res.status(400).json({
        message: "Title, Author and Total Pages are required"
      });
    }

    if (pages_completed > total_pages) {
      return res.status(400).json({
        message: "Pages completed cannot exceed total pages"
      });
    }

    const progress =
      total_pages > 0
        ? (pages_completed / total_pages) * 100
        : 0;

    await pool.query(
      `INSERT INTO books
      (user_id, title, author, total_pages, pages_completed,
       target_date, genre, review, rating, description,
       progress_percentage)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        author,
        total_pages,
        pages_completed,
        target_date || null,
        genre || null,
        review || null,
        rating,
        description || null,
        progress
      ]
    );

    res.status(201).json({ message: "Book added successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* =========================
   GET ALL BOOKS
========================= */
exports.getBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const search = req.query.search || "";

    const [books] = await pool.query(
      `SELECT * FROM books
       WHERE user_id = ?
       AND (title LIKE ? OR author LIKE ?)`,
      [userId, `%${search}%`, `%${search}%`]
    );

    res.json(books);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* =========================
   GET BOOK BY ID
========================= */
exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT * FROM books WHERE id=? AND user_id=?",
      [bookId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* =========================
   UPDATE PROGRESS
========================= */
exports.updateBookProgress = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;
    let { pages_completed } = req.body;

    pages_completed = Number(pages_completed);

    if (isNaN(pages_completed) || pages_completed < 0) {
      return res.status(400).json({
        message: "Invalid pages value"
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM books WHERE id=? AND user_id=?",
      [bookId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const book = rows[0];

    if (pages_completed > book.total_pages) {
      return res.status(400).json({
        message: "Pages cannot exceed total pages"
      });
    }

    const progress =
      (pages_completed / book.total_pages) * 100;

    await pool.query(
      `UPDATE books
       SET pages_completed=?, progress_percentage=?
       WHERE id=? AND user_id=?`,
      [pages_completed, progress, bookId, userId]
    );

    res.json({ message: "Progress updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* =========================
   UPDATE RATING
========================= */
exports.updateRating = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;
    let { rating } = req.body;

    rating = Number(rating);

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 0 and 5"
      });
    }

    await pool.query(
      "UPDATE books SET rating=? WHERE id=? AND user_id=?",
      [rating, bookId, userId]
    );

    res.json({ message: "Rating updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/* =========================
   DELETE BOOK
========================= */
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT * FROM books WHERE id=? AND user_id=?",
      [bookId, userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    await pool.query(
      "DELETE FROM books WHERE id=? AND user_id=?",
      [bookId, userId]
    );

    res.json({ message: "Book deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(c500).json({ error: error.message });
  }
};
