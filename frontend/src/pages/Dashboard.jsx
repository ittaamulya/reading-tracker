import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    reading: 0,
    completed: 0,
    avgRating: 0,
  });

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newPages, setNewPages] = useState("");

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await axios.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch books with search
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`/books?search=${search}`);
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search]);

  // Update progress function
  const handleUpdate = async (bookId) => {
    try {
      await axios.put(`/books/${bookId}`, {
        pages_completed: Number(newPages),
      });

      setEditingId(null);
      setNewPages("");

      fetchBooks();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating progress");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-amber-900">
        📖 Reading Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl">Currently Reading</h2>
          <p className="text-3xl">{stats.reading}</p>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl">Completed</h2>
          <p className="text-3xl">{stats.completed}</p>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl">Average Rating</h2>
          <p className="text-3xl">
            {Number(stats.avgRating).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-8 rounded-lg border shadow"
      />

      {/* Books Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white border-l-8 border-amber-700 p-6 rounded-xl shadow-xl"
          >
            <h2 className="text-2xl font-bold text-amber-900">
              {book.title}
            </h2>

            <p className="text-gray-700 mb-1">
              <strong>Author:</strong> {book.author}
            </p>

            <p>
              <strong>Genre:</strong> {book.genre || "N/A"}
            </p>

            <p>
              <strong>Status:</strong> {book.status}
            </p>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${book.progress_percentage}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm mt-1">
                {Number(book.progress_percentage).toFixed(1)}% completed
              </p>
            </div>

            <p className="mt-2">
              <strong>Rating:</strong> ⭐ {book.rating}/5
            </p>

            <p className="italic text-gray-600 mt-2">
              "{book.review || "No review yet"}"
            </p>

            {/* EDIT PROGRESS SECTION */}
            <div className="mt-4">
              {editingId === book.id ? (
                <>
                  <input
                    type="number"
                    placeholder="Enter pages completed"
                    value={newPages}
                    onChange={(e) => setNewPages(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                  />

                  <button
                    onClick={() => handleUpdate(book.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(null);
                      setNewPages("");
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(book.id);
                    setNewPages(book.pages_completed);
                  }}
                  className="bg-amber-700 text-white px-4 py-2 rounded mt-2"
                >
                  ✏️ Edit Progress
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
