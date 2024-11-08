import React, { useState } from "react";
import ProductSaleForm from "./ProductSaleForm";
import BookSetSaleForm from "./BookSetSaleForm";

const SalesDashboard = () => {
  const [selectedForm, setSelectedForm] = useState("product"); // Track selected form

  // Toggle between product sale form and book set sale form
  const handleFormChange = (formType) => {
    setSelectedForm(formType);
  };

  return (
    <div>
      <h1>Sales Dashboard</h1>
      {/* Buttons to switch between forms */}
      <div>
        <button onClick={() => handleFormChange("product")}>
          Product Sale
        </button>
        <button onClick={() => handleFormChange("bookSet")}>
          Book Set Sale
        </button>
      </div>
      {/* Conditionally render forms based on the selected form */}
      {selectedForm === "product" && <ProductSaleForm />}{" "}
      {/* Show Product Sale Form */}
      {selectedForm === "bookSet" && <BookSetSaleForm />}{" "}
      {/* Show Book Set Sale Form */}
    </div>
  );
};

export default SalesDashboard;