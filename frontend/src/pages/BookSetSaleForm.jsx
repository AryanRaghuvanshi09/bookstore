import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import API from "../services/api";

const BookSetSaleForm = () => {
  const [bookSets, setBookSets] = useState([]);
  const [filteredBookSets, setFilteredBookSets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copies, setCopies] = useState([]);
  const [selectedBookSet, setSelectedBookSet] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedCopies, setSelectedCopies] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [invoice, setInvoice] = useState(null); // Invoice state to store invoice details

  useEffect(() => {
    const fetchBookSets = async () => {
      try {
        const response = await API.get("/book-sets");
        setBookSets(response.data);
        setFilteredBookSets(response.data);
      } catch (error) {
        console.error("Error fetching book sets:", error);
      }
    };

    fetchBookSets();
  }, []);

  useEffect(() => {
    const fetchCopies = async () => {
      if (selectedBookSet) {
        try {
          const response = await API.get(
            `/copies?bookSetId=${selectedBookSet}`
          );
          setCopies(response.data);
        } catch (error) {
          console.error("Error fetching copies:", error);
        }
      }
    };

    fetchCopies();
  }, [selectedBookSet]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = bookSets.filter((bookSet) =>
      `${bookSet.school} ${bookSet.className}`
        .toLowerCase()
        .includes(searchValue)
    );
    setFilteredBookSets(filtered);
  };

  const handleCopySelection = (e, copyName) => {
    if (e.target.checked) {
      setSelectedCopies((prev) => ({ ...prev, [copyName]: 1 }));
    } else {
      const { [copyName]: _, ...rest } = selectedCopies;
      setSelectedCopies(rest);
    }
  };

  const handleCopyQuantityChange = (copyName, quantity) => {
    setSelectedCopies((prev) => ({
      ...prev,
      [copyName]: parseInt(quantity, 10),
    }));
  };

  const calculateTotalCost = () => {
    const bookSet = bookSets.find((set) => set._id === selectedBookSet);
    let cost = bookSet ? bookSet.setPrice * quantity : 0;

    Object.keys(selectedCopies).forEach((copyName) => {
      const selectedCopy = copies.find((copy) => copy.name === copyName);
      if (selectedCopy) {
        cost += selectedCopy.price * selectedCopies[copyName];
      }
    });

    setTotalCost(cost);
  };

  useEffect(calculateTotalCost, [selectedBookSet, quantity, selectedCopies]);

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
        copies: Object.keys(selectedCopies).length ? selectedCopies : null,
      });

      const bookSet = bookSets.find((set) => set._id === selectedBookSet);
      const invoiceData = {
        bookSetName: `${bookSet.school} - ${bookSet.className}`,
        quantity,
        pricePerUnit: bookSet.setPrice,
        totalCost,
        date: new Date().toLocaleDateString(),
        selectedCopies,
      };

      setInvoice(invoiceData);
      generatePDF(invoiceData);

      alert(response.data.message);
    } catch (error) {
      console.error("Error processing bookset sale:", error);
      alert("Bookset sale failed.");
    }
  };

  const generatePDF = (invoiceData) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${invoiceData.date}`, 20, 30);
    doc.text(`Book Set: ${invoiceData.bookSetName}`, 20, 40);
    doc.text(`Quantity: ${invoiceData.quantity}`, 20, 50);
    doc.text(`Price per Unit: $${invoiceData.pricePerUnit}`, 20, 60);
    doc.text(`Total Cost: $${invoiceData.totalCost}`, 20, 70);

    // Display selected copies if any
    doc.text("Selected Copies:", 20, 80);
    let yOffset = 90;
    if (Object.keys(invoiceData.selectedCopies).length) {
      Object.keys(invoiceData.selectedCopies).forEach((copyName) => {
        doc.text(
          `${copyName}: ${invoiceData.selectedCopies[copyName]} unit(s)`,
          20,
          yOffset
        );
        yOffset += 10;
      });
    } else {
      doc.text("No copies selected", 20, yOffset);
    }

    doc.save("bookset_invoice.pdf"); // Save the PDF as "bookset_invoice.pdf"
  };

  return (
    <div>
      <h2>Book Set Sale</h2>
      <form onSubmit={handleBookSetSale}>
        <label>Search Book Set:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by school or class"
        />

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

        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

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
          <h3>Total Cost: ${totalCost.toFixed(2)}</h3>
        </div>

        <button type="submit">Sell Book Set</button>
      </form>

      {/* Invoice Section */}
      {invoice && (
        <div>
          <h3>Invoice</h3>
          <p>Book Set: {invoice.bookSetName}</p>
          <p>Quantity: {invoice.quantity}</p>
          <p>Price per Unit: ${invoice.pricePerUnit}</p>
          <p>Total Cost: ${invoice.totalCost}</p>
          <p>Date: {invoice.date}</p>

          <h4>Selected Copies:</h4>
          {Object.keys(invoice.selectedCopies).length ? (
            <ul>
              {Object.keys(invoice.selectedCopies).map((copyName) => (
                <li key={copyName}>
                  {copyName}: {invoice.selectedCopies[copyName]} unit(s)
                </li>
              ))}
            </ul>
          ) : (
            <p>No copies selected</p>
          )}

          {/* Button to re-download the invoice as PDF */}
          <button onClick={() => generatePDF(invoice)}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default BookSetSaleForm;
