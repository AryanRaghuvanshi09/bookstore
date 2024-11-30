import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/GetBookset.css"; // Import the CSS here

const BookSets = () => {
  const [bookSets, setBookSets] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null); // State to track selected school
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

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

  const handleSchoolClick = (schoolId) => {
    // Toggle the display of details for the clicked school
    if (selectedSchool === schoolId) {
      setSelectedSchool(null); // Deselect if the same school is clicked again
    } else {
      setSelectedSchool(schoolId);
    }
  };

  // Filter book sets based on search query
  const filteredBookSets = bookSets.filter((set) =>
    set.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="book-sets-container">
      <h2>Book Sets</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by school name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredBookSets.length > 0 ? (
        <ul className="book-set-list">
          {filteredBookSets.map((set) => (
            <li key={set._id} className="book-set-item">
              <div className="set-info">
                {/* Display school name as clickable */}
                <h3
                  onClick={() => handleSchoolClick(set._id)}
                  className="school-name"
                >
                  {set.school} - Class {set.className}
                </h3>

                {/* Show detailed info only if the school is selected */}
                {selectedSchool === set._id && (
                  <>
                    <p><strong>Total Set Price:</strong> Rs. {set.setPrice}</p>
                    <p><strong>Total Quantity:</strong> {set.totalQuantity}</p>
                    <div className="books-details">
                      <h4>Books in Set:</h4>
                      <ul className="books-list">
                        {set.books.map((book, index) => (
                          <li key={index} className="book-item">
                            <p><strong>Book Name:</strong> {book.name}</p>
                            <p><strong>Price:</strong> Rs. {book.price}</p>
                            <p><strong>Quantity:</strong> {book.quantity}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No book sets found...</p>
      )}
    </div>
  );
};

export default BookSets;
