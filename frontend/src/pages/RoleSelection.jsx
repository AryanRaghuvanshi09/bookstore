// RoleSelection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    navigate(`/login/${role}`);
  };

  const handleSalesInsightsLogin = () => {
    navigate("/login/admin?redirect=sales-insights"); // Login for Sales Insights Dashboard
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <button onClick={() => handleRoleSelection("admin")}>Admin</button>
      <button onClick={() => handleRoleSelection("salesperson")}>
        Salesperson
      </button>

      {/* Button for Sales Insights Dashboard Login */}
      <button onClick={handleSalesInsightsLogin}>
        Sales Insights Dashboard
      </button>
    </div>
  );
};

export default RoleSelection;
