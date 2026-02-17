import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author: "",
    total_pages: 0,
    pages_completed: 0,
    target_date: "",
    genre: "",
    review: "",
    rating: 0,
    description: "",
    status: "",
  });

  const handleSubmit = async () => {
    try {
      await axios.post("/books", book);
      alert("Book added successfully");
      navigate("/home");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error adding book");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Add Book</h2>

      <input
        placeholder="Title"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setBook({ ...book, title: e.target.value })
        }
      />

      <input
        placeholder="Author"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setBook({ ...book, author: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Total Pages"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setBook({ ...book, total_pages: Number(e.target.value) })
        }
      />

      <input
        type="number"
        placeholder="Pages Completed"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setBook({ ...book, pages_completed: Number(e.target.value) })
        }
      />

      <input
        type="date"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setBook({ ...book, target_date: e.target.value })
        }
      />

      <input
        placeholder="Genre"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setBook({ ...book, genre: e.target.value })
        }
      />

      <textarea
        placeholder="Review"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setBook({ ...book, review: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Rating (1-5)"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setBook({ ...book, rating: Number(e.target.value) })
        }
      />


      <textarea
  placeholder="Book Description (Optional)"
  className="border p-2 w-full mb-3 rounded"
  onChange={(e) =>
    setBook({ ...book, description: e.target.value })
  }
/>


      <button
        onClick={handleSubmit}
        className="bg-purple-500 text-white px-6 py-2 rounded w-full"
      >
        Add Book
      </button>
    </div>
  );
}
