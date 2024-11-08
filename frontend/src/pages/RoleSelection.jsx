// RoleSelection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleRoleSelection = (role) => {
    navigate(`/login/${role}`); // Navigate to login with the selected role
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <button onClick={() => handleRoleSelection("admin")}>Admin</button>
      <button onClick={() => handleRoleSelection("salesperson")}>
        Salesperson
      </button>
    </div>
  );
};

export default RoleSelection;
