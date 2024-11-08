import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/GetBookSet.css"; // Import the CSS here

const BookSets = () => {
  const [bookSets, setBookSets] = useState([]);

  useEffect(() => {
    const fetchBookSets = async () => {
      try {
        const response = await API.get("/book-sets");
        setBookSets(response.data);
      } catch (error) {
        console.error("Error fetching book sets", error);
      }
    };
    fetchBookSets();
  }, []);

  return (
    <div className="book-sets-container">
      <h2>Book Sets</h2>
      <ul className="book-set-list">
        {bookSets.map((set) => (
          <li key={set._id} className="book-set-item">
            <span className="set-info">
              {set.school} - {set.className}
            </span>
            <span className="set-price">${set.setPrice}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSets;
