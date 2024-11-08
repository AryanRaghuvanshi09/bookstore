// Login.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate
import API from "../services/api";

const Login = () => {
  const { role } = useParams(); // Get the role from URL
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(`/auth/login`, { ...formData, role }); // Send the role with login request
      localStorage.setItem("token", response.data.token);
      alert("Login successful");
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "salesperson") {
        navigate("/salesperson-dashboard");
      }
    } catch (error) {
      console.error("Login error", error);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
