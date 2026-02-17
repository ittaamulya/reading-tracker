import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [editingPages, setEditingPages] = useState({});
  const [editingRating, setEditingRating] = useState({});

  const navigate = useNavigate();

  // ⭐ Star Rendering (Half Star Support)
  const renderStars = (rating) => {
    rating = Number(rating) || 0;

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      "★".repeat(fullStars) +
      (halfStar ? "⯨" : "") +
      "☆".repeat(emptyStars)
    );
  };

  // 📚 Fetch Books
  const fetchBooks = async () => {
    try {
      const res = await axios.get(
        `/books?search=${search}&genre=${genreFilter}`
      );

      setBooks(res.data || []);

      const pages = {};
      const ratings = {};

      (res.data || []).forEach(book => {
        pages[book.id] = book.pages_completed || 0;
        ratings[book.id] = book.rating || 0;
      });

      setEditingPages(pages);
      setEditingRating(ratings);

    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, genreFilter]);

  // 📄 Update Pages
  const updateProgress = async (id) => {
    try {
      await axios.put(`/books/${id}`, {
        pages_completed: editingPages[id] || 0
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  // ⭐ Update Rating
  const updateRating = async (id) => {
    try {
      await axios.put(`/books/rating/${id}`, {
        rating: editingRating[id] || 0
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑 Delete Book
  const deleteBook = async (id) => {
    try {
      await axios.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 p-8">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-4xl font-bold text-amber-800">
          📚 My Reading Library
        </h1>

        <Link
          to="/add"
          className="bg-purple-600 text-white px-6 py-2 rounded-xl"
        >
          + Add Book
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title or author..."
        className="border p-3 rounded-xl w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Genre Filter */}
      <select
        className="border p-3 rounded-xl w-full mb-8"
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
      >
        <option value="">All Genres</option>
        <option value="Fiction">Fiction</option>
        <option value="Non-Fiction">Non-Fiction</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Science">Science</option>
        <option value="Biography">Biography</option>
      </select>

      {/* Books Grid */}
      <div className="grid md:grid-cols-3 gap-8">

        {books.map(book => {

          // 📅 Show ONLY date (remove time)
          const formattedDate = book.target_date
            ? new Date(book.target_date).toISOString().split("T")[0]
            : null;

          return (
            <div
              key={book.id}
              className="relative bg-white rounded-2xl shadow-xl p-6
              hover:scale-105 transition duration-300
              border-l-8 border-amber-600"
            >

              {/* Target Date (Date Only) */}
              {formattedDate && (
                <div className="absolute top-3 right-3 text-xs bg-indigo-500 text-white px-2 py-1 rounded-lg">
                  {formattedDate}
                </div>
              )}

              <h2 className="text-xl font-bold">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>

              {/* Genre */}
              {book.genre && (
                <p className="text-sm mt-1 text-purple-600">
                  {book.genre}
                </p>
              )}

              {/* Description */}
              {book.description && (
                <p className="mt-3 text-sm text-gray-600">
                  {book.description}
                </p>
              )}

              {/* Rating Display */}
              <p className="mt-3 text-yellow-600 text-lg">
                {renderStars(book.rating)} ({book.rating || 0})
              </p>

              {/* Edit Rating */}
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={editingRating[book.id] || 0}
                onChange={(e) =>
                  setEditingRating({
                    ...editingRating,
                    [book.id]: e.target.value
                  })
                }
                className="border p-2 rounded w-full mt-2"
              />

              <button
                onClick={() => updateRating(book.id)}
                className="bg-purple-500 text-white px-4 py-2 rounded w-full mt-2"
              >
                Update Rating
              </button>

              {/* Open */}
              <button
                onClick={() => navigate(`/book/${book.id}`)}
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700"
              >
                Open
              </button>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{
                      width: `${book.progress_percentage || 0}%`
                    }}
                  ></div>
                </div>

                <p className="mt-2 text-sm">
                  {book.pages_completed || 0} / {book.total_pages}
                </p>
              </div>

              {/* Edit Pages */}
              <input
                type="number"
                value={editingPages[book.id] || 0}
                onChange={(e) =>
                  setEditingPages({
                    ...editingPages,
                    [book.id]: e.target.value
                  })
                }
                className="border p-2 rounded w-full mt-2"
              />

              <button
                onClick={() => updateProgress(book.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2"
              >
                Update Progress
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteBook(book.id)}
                className="bg-red-500 text-white px-4 py-2 rounded w-full mt-3"
              >
                Delete Book
              </button>

            </div>
          );
        })}

      </div>
    </div>
  );
}
