import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import API from "../services/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "../styles/Salesinsight.css";

const SalesInsightsDashboard = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    productRevenue: 0,
    bookSetRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    setLoading(true);
    fetchSalesData();
  }, [token]);

  const fetchSalesData = async () => {
    try {
      const revenueResponse = await API.get("/sales/revenue", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSalesData({
        totalRevenue: revenueResponse.data.totalRevenue || 0,
        productRevenue: revenueResponse.data.productRevenue || 0,
        bookSetRevenue: revenueResponse.data.bookSetRevenue || 0,
      });
      setLoading(false);
    } catch (error) {
      setError(error.response?.data || "Error fetching sales data");
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress color="primary" className="loading-spinner" />;
  }

  if (error) {
    return <Typography color="error" className="error-message">{error}</Typography>;
  }

  return (
    <Box className="dashboard-container">
      <Typography variant="h3" gutterBottom align="center" className="dashboard-title">
        Sales Insights Dashboard
      </Typography>

      <Typography variant="h5" gutterBottom align="center" className="total-revenue">
        Total Revenue: Rs.{salesData.totalRevenue.toFixed(2)}
      </Typography>

      {/* Toggle Buttons for Chart Navigation */}
      <Box display="flex" justifyContent="center" marginBottom={3}>
        <Button
          variant="contained"
          onClick={() => navigate("/product-sales")} // Navigate to product sales page
          className="chart-toggle-button"
        >
          Product Sales
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/book-set-sales")} // Navigate to book set sales page
          className="chart-toggle-button"
        >
          Book Set Sales
        </Button>
      </Box>
    </Box>
  );
};

export default SalesInsightsDashboard;
