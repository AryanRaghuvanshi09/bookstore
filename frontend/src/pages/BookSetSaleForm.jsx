import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { Paper, Typography, Box, Divider } from "@mui/material";
import { Bar } from "react-chartjs-2";
import ChartJS from "chart.js/auto";  // Auto imports the necessary chart components
import API from "../services/api";

const BooksetSalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await API.get("/sales/booksets");
      setSalesData(response.data.sales || []);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data || "Error fetching sales data");
      setLoading(false);
    }
  };

  // Chart data for all booksets
  const chartData = {
    labels: salesData.map(item => item.booksetName),  // X-axis: Bookset names
    datasets: [
      {
        label: "Quantity Sold",
        data: salesData.map(item => item.totalQuantitySold),
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1
      },
      {
        label: "Total Revenue",
        data: salesData.map(item => item.totalRevenue),
        backgroundColor: "#FF9800",
        borderColor: "#F57C00",
        borderWidth: 1
      },
      {
        label: "Average Price",
        data: salesData.map(item => item.averagePrice),
        backgroundColor: "#2196F3",
        borderColor: "#1976D2",
        borderWidth: 1
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Bookset Name'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sales Data'
        }
      }
    }
  };

  const Row = ({ index, style }) => (
    <div style={style}>
      <Paper sx={{ padding: 2, marginBottom: 1, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="body1">
          <strong>{salesData[index].booksetName}</strong>
          <br />
          <span style={{ color: "#4CAF50" }}>Quantity Sold: {salesData[index].totalQuantitySold}</span>
          <br />
          <span style={{ color: "#FF9800" }}>Total Revenue: ${salesData[index].totalRevenue.toFixed(2)}</span>
          <br />
          <span style={{ color: "#2196F3" }}>Average Price: ${salesData[index].averagePrice.toFixed(2)}</span>
        </Typography>
      </Paper>
    </div>
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h3" gutterBottom align="center">
        Bookset Sales
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
        {/* Chart for all booksets */}
        <Box sx={{ width: "70%", marginRight: 2 }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Bookset Sales Overview</Typography>
            <Bar data={chartData} options={options} height={500} />
          </Paper>
        </Box>

        {/* Bookset List */}
        <Box sx={{ width: "30%" }}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>Bookset Sales List</Typography>
            <List
              height={400}
              itemCount={salesData.length}
              itemSize={120}  // Adjust height per item
              width={"100%"}
            >
              {Row}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default BooksetSalesPage;
