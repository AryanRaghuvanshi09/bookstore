import React from "react";
import { Link } from "react-router-dom";
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Management Dashboard</h2>
      <p>Welcome, Admin!</p>
      <div className="button-container">
        <Link to="/add-product" className="link-button">Add Product</Link>
        <Link to="/add-bookset" className="link-button">Add Book Set</Link>
        <Link to="/get-product" className="link-button">Get Product</Link>
        <Link to="/get-bookset" className="link-button">Get Book Set</Link>
        <Link to="/add-copies" className="link-button">Add Copies</Link>
        <Link to="/get-copies" className="link-button">Get Copies</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
