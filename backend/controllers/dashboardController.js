const pool = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [reading] = await pool.query(
      "SELECT COUNT(*) as total FROM books WHERE user_id=? AND status='Reading'",
      [userId]
    );

    const [completed] = await pool.query(
      "SELECT COUNT(*) as total FROM books WHERE user_id=? AND status='Completed'",
      [userId]
    );

    const [rating] = await pool.query(
      "SELECT AVG(rating) as avg FROM books WHERE user_id=?",
      [userId]
    );

    res.json({
      reading: reading[0].total,
      completed: completed[0].total,
      avgRating: rating[0].avg || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
