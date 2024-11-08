import React, { useState, useEffect } from "react";
import API from "../services/api";

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
    <div>
      <h2>Book Sets</h2>
      <ul>
        {bookSets.map((set) => (
          <li key={set._id}>
            {set.school} - {set.className} - ${set.setPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSets;
