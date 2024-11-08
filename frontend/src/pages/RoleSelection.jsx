import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div className="role-selection">
      <nav className="navbar">
        {/* Your company logo or name here */}
        <h1 className="navbar-title">Swastik Traders</h1>
        <h4>(Shastripuram Agra)</h4>
      </nav>

      <main className="main-content">
        <div className="role-card">
          <h2>Select Your Role</h2>
          <button className="role-button" onClick={() => handleRoleSelection('admin')}>
            <h4>Admin</h4>
          </button>
          <button className="role-button" onClick={() => handleRoleSelection('salesperson')}>
          <h4>Salesperson</h4>
          </button>
        </div>
      </main>
    </div>
  );
};

export default RoleSelection;
