import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios.get(`/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!book) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold">{book.title}</h1>
        <p className="text-lg mt-2">by {book.author}</p>

        {book.description && (
          <>
            <h3 className="mt-6 font-semibold">Description</h3>
            <p className="text-gray-700 mt-2">{book.description}</p>
          </>
        )}

        {book.review && (
          <>
            <h3 className="mt-6 font-semibold">Review</h3>
            <p className="text-gray-700 mt-2">{book.review}</p>
          </>
        )}

        <div className="mt-6 space-y-2">
          <p><b>Genre:</b> {book.genre}</p>
          <p><b>Status:</b> {book.status}</p>
          <p><b>Target Date:</b> {book.target_date?.split("T")[0]}</p>
          <p><b>Rating:</b> {book.rating}</p>
          <p><b>Progress:</b> {book.pages_completed} / {book.total_pages}</p>
        </div>

      </div>
    </div>
  );
}
