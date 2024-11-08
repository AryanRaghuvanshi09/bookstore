import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import SalespersonDashboard from "./pages/SalespersonDashboard";
import AddProduct from "./pages/AddProduct";
import AddBookSet from "./pages/AddBookSet";
import BookSets from "./pages/BookSets";
import GetProduct from "./pages/GetProduct";
import AddCopy from "./pages/AddCopies";
import GetCopies from "./pages/GetCopies";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/salesperson-dashboard" element={<SalespersonDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/add-bookset" element={<AddBookSet />} />
        <Route path="/get-bookset" element={<BookSets />} />
        <Route path="/get-product" element={<GetProduct />} />
        <Route path="/add-copies" element={<AddCopy />} />
        <Route path="/get-copies" element={<GetCopies />} />
      </Routes>
    </Router>
  );
};

export default App;