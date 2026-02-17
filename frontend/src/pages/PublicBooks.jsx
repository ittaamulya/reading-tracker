import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function PublicBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("/books/public");
      setBooks(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🌍 Community Reviews</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white p-5 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            <p className="mt-2 text-sm italic">By {book.name}</p>
            <p className="mt-3">{book.review}</p>
            <p className="mt-2">⭐ {book.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
