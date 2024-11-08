// AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin!</p>
      <Link to="/add-product">Add Product</Link>
      <br />
      <Link to="/add-bookset">Add Book Set</Link>
      <br />
      <Link to="/get-product">Get Product</Link>
      <br />
      <Link to="/get-bookset">Get Book Set</Link>
      <br />
      <Link to="/add-copies">Add Copies</Link>
      <br />
      <Link to="/get-copies">Get Copies</Link>
    </div>
  );
};

export default AdminDashboard;
