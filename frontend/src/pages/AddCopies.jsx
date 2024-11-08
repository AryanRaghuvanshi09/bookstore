// pages/AddCopy.js
import React, { useState } from "react";
import API from "../services/api";

const AddCopy = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stock: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/copies/create", formData); // Adjust the URL as per your API
      alert("Copy added successfully");
      setFormData({ name: "", price: 0, stock: 0 }); // Reset the form after successful submission
    } catch (error) {
      console.error("Error adding copy", error);
      alert("Error adding copy");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Copy</h2>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      />
      <input
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
      />
      <button type="submit">Add Copy</button>
    </form>
  );
};

export default AddCopy;
