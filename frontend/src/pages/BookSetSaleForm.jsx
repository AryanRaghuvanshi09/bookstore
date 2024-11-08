import React, { useState, useEffect } from "react";
import API from "../services/api";

const BookSetSaleForm = () => {
  const [bookSets, setBookSets] = useState([]); // Store booksets list
  const [filteredBookSets, setFilteredBookSets] = useState([]); // Store filtered booksets based on search
  const [searchTerm, setSearchTerm] = useState(""); // Store search term
  const [copies, setCopies] = useState([]); // Store copies for selected bookset
  const [selectedBookSet, setSelectedBookSet] = useState(""); // Selected bookset
  const [quantity, setQuantity] = useState(1); // Quantity to sell
  const [selectedCopies, setSelectedCopies] = useState({}); // Store selected copies with quantities
  const [totalCost, setTotalCost] = useState(0); // Store total cost

  // Fetch book sets when component loads
  useEffect(() => {
    const fetchBookSets = async () => {
      try {
        const response = await API.get("/book-sets"); // Fetch available book sets
        setBookSets(response.data);
        setFilteredBookSets(response.data); // Initialize the filteredBookSets
      } catch (error) {
        console.error("Error fetching book sets:", error);
      }
    };

    fetchBookSets();
  }, []);

  // Fetch copies when a bookset is selected
  useEffect(() => {
    const fetchCopies = async () => {
      if (selectedBookSet) {
        try {
          const response = await API.get(`/copies?bookSetId=${selectedBookSet}`); // Fetch copies for selected bookset
          setCopies(response.data);
        } catch (error) {
          console.error("Error fetching copies:", error);
        }
      }
    };

    fetchCopies();
  }, [selectedBookSet]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter book sets based on search term (school + className)
    const filtered = bookSets.filter((bookSet) =>
      `${bookSet.school} ${bookSet.className}`.toLowerCase().includes(searchValue)
    );
    setFilteredBookSets(filtered);
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    if (!selectedBookSet) return 0; // Ensure there's a selected book set

    // Find selected book set by ID
    const bookSet = bookSets.find((set) => set._id === selectedBookSet);
    let cost = bookSet ? bookSet.setPrice * quantity : 0; // Calculate cost for book set

    // Add cost for selected copies
    Object.keys(selectedCopies).forEach((copyName) => {
      const selectedCopy = copies.find((copy) => copy.name === copyName);
      if (selectedCopy) {
        cost += selectedCopy.price * selectedCopies[copyName]; // Multiply price by selected quantity
      }
    });

    setTotalCost(cost); // Update total cost state
  };

  // Handle bookset sale
  const handleBookSetSale = async (e) => {
    e.preventDefault();

    if (!selectedBookSet || !quantity) {
      alert("Please select a bookset and quantity.");
      return;
    }

    try {
      const response = await API.post("/sales/book-set", {
        bookSetId: selectedBookSet,
        quantity,
        copies: Object.keys(selectedCopies).length ? selectedCopies : null, // Include copies only if selected
      });
      alert(response.data.message); // Show success message
    } catch (error) {
      console.error("Error processing bookset sale:", error);
      alert("Bookset sale failed.");
    }
  };

  // Handle copy selection/deselection
  const handleCopySelection = (e, name) => {
    setSelectedCopies((prevCopies) => {
      const updatedCopies = { ...prevCopies };

      if (e.target.checked) {
        updatedCopies[name] = 1; // Default quantity to 1 if checked
      } else {
        delete updatedCopies[name];
      }

      return updatedCopies;
    });
  };

  // Handle quantity change for a selected copy
  const handleCopyQuantityChange = (name, newQuantity) => {
    setSelectedCopies((prevCopies) => {
      return {
        ...prevCopies,
        [name]: Math.max(1, newQuantity), // Ensure quantity is at least 1
      };
    });
  };

  // Update total cost whenever quantity or selected copies change
  useEffect(() => {
    calculateTotalCost();
  }, [selectedBookSet, quantity, selectedCopies]);

  return (
    <div>
      <h2>Book Set Sale</h2>
      <form onSubmit={handleBookSetSale}>
        {/* Search Input */}
        <label>Search Book Set:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by school or class"
        />

        {/* Select Book Set */}
        <label>Select Book Set:</label>
        <select
          value={selectedBookSet}
          onChange={(e) => setSelectedBookSet(e.target.value)}
        >
          <option value="">--Select Book Set--</option>
          {filteredBookSets.map((bookSet) => (
            <option key={bookSet._id} value={bookSet._id}>
              {bookSet.school} - {bookSet.className}
            </option>
          ))}
        </select>

        {/* Quantity to sell */}
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {/* Select Copies (Optional) */}
        <label>Select Copies (Optional):</label>
        <div>
          {copies.map((copy) => (
            <div key={copy._id}>
              <input
                type="checkbox"
                id={copy._id}
                checked={selectedCopies[copy.name] !== undefined}
                onChange={(e) => handleCopySelection(e, copy.name)}
              />
              <label>{copy.name}</label>

              {/* Quantity input for each selected copy */}
              {selectedCopies[copy.name] !== undefined && (
                <input
                  type="number"
                  min="1"
                  value={selectedCopies[copy.name]}
                  onChange={(e) =>
                    handleCopyQuantityChange(copy.name, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div>
          <h3>Total Cost: ${totalCost.toFixed(2)}</h3>{" "}
          {/* Display Total Cost */}
        </div>

        <button type="submit">Sell Book Set</button>
      </form>
    </div>
  );
};

export default BookSetSaleForm;
