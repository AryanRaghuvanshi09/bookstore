import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import API from "../services/api"; // Import API service
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement, // Register LineElement for Line charts
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale, // For the "category" scale (used by Bar and Line charts)
  LinearScale, // For the linear scale (used by the y-axis in the Bar and Line charts)
  BarElement, // For Bar charts
  ArcElement, // For Pie charts
  PointElement, // For points in Line charts
  LineElement, // For lines in Line charts
  Title, // For chart titles
  Tooltip, // For tooltips
  Legend // For legends
);

const SalesInsightsDashboard = () => {
  const [productSales, setProductSales] = useState([]);
  const [bookSetSales, setBookSetSales] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState({});
  const [datewiseSales, setDatewiseSales] = useState({});
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Fetch Products and Book Sets with Authorization
        const productSalesResponse = await API.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookSetSalesResponse = await API.get("/book-sets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProductSales(productSalesResponse.data);
        setBookSetSales(bookSetSalesResponse.data);

        // Calculate Total Revenue
        calculateTotalRevenue(
          productSalesResponse.data,
          bookSetSalesResponse.data
        );

        // Calculate monthly revenue and datewise sales
        calculateMonthlyRevenue(
          productSalesResponse.data,
          bookSetSalesResponse.data
        );
        calculateDatewiseSales(
          productSalesResponse.data,
          bookSetSalesResponse.data
        );
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    if (token) {
      fetchSalesData();
    }
  }, [token]);

  // Function to calculate total revenue dynamically
  const calculateTotalRevenue = (productSales, bookSetSales) => {
    const totalProductRevenue = productSales.reduce(
      (acc, product) => acc + product.price * product.stock,
      0
    );
    const totalBookSetRevenue = bookSetSales.reduce(
      (acc, set) => acc + set.setPrice * set.totalQuantity,
      0
    );
    setTotalRevenue(totalProductRevenue + totalBookSetRevenue);
  };

  // Function to calculate monthly revenue
  const calculateMonthlyRevenue = (productSales, bookSetSales) => {
    const salesData = [...productSales, ...bookSetSales];
    const monthlyRevenue = {};

    salesData.forEach((item) => {
      const date = new Date(item.date || Date.now()); // Use Date.now() for mock dates
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const saleAmount = item.setPrice || item.price * item.stock;

      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + saleAmount;
    });
    setMonthlyRevenueData(monthlyRevenue);
  };

  // Function to calculate datewise sales for line chart
  const calculateDatewiseSales = (productSales, bookSetSales) => {
    const salesData = [...productSales, ...bookSetSales];
    const datewise = {};

    salesData.forEach((item) => {
      const date = new Date(item.date || Date.now()).toLocaleDateString();
      const saleAmount = item.setPrice || item.price * item.stock;

      datewise[date] = (datewise[date] || 0) + saleAmount;
    });
    setDatewiseSales(datewise);
  };

  // Handle product sale
  const handleProductSale = async (productId, quantity) => {
    try {
      const response = await API.post(
        "/sales/product",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update product sales and total revenue
      const updatedProductSales = [...productSales];
      const productIndex = updatedProductSales.findIndex(
        (product) => product._id === productId
      );
      if (productIndex !== -1) {
        updatedProductSales[productIndex].stock -= quantity;
        setProductSales(updatedProductSales);
        calculateTotalRevenue(updatedProductSales, bookSetSales);
      }
    } catch (error) {
      console.error("Error processing product sale:", error);
    }
  };

  // Handle book set sale
  const handleBookSetSale = async (bookSetId, quantity, copies) => {
    try {
      const response = await API.post(
        "/sales/book-set",
        { bookSetId, quantity, copies },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update book set sales and total revenue
      const updatedBookSetSales = [...bookSetSales];
      const bookSetIndex = updatedBookSetSales.findIndex(
        (set) => set._id === bookSetId
      );
      if (bookSetIndex !== -1) {
        updatedBookSetSales[bookSetIndex].totalQuantity -= quantity;
        setBookSetSales(updatedBookSetSales);
        calculateTotalRevenue(productSales, updatedBookSetSales);
      }
    } catch (error) {
      console.error("Error processing book set sale:", error);
    }
  };

  // Chart data for monthly revenue
  const monthlyRevenueChartData = {
    labels: Object.keys(monthlyRevenueData),
    datasets: [
      {
        label: "Monthly Revenue",
        data: Object.values(monthlyRevenueData),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Chart data for datewise sales
  const datewiseSalesChartData = {
    labels: Object.keys(datewiseSales),
    datasets: [
      {
        label: "Datewise Sales",
        data: Object.values(datewiseSales),
        borderColor: "rgba(54, 162, 235, 0.6)",
        fill: false,
      },
    ],
  };

  // Pie chart data for revenue split between products and book sets
  const revenueSplitData = {
    labels: ["Products", "Book Sets"],
    datasets: [
      {
        data: [
          productSales.reduce(
            (acc, product) => acc + product.price * product.stock,
            0
          ),
          bookSetSales.reduce(
            (acc, set) => acc + set.setPrice * set.totalQuantity,
            0
          ),
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <div>
      <h1>Sales Insights Dashboard</h1>
      <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={{ width: "45%" }}>
          <h3>Monthly Revenue</h3>
          <Bar data={monthlyRevenueChartData} />
        </div>

        <div style={{ width: "45%" }}>
          <h3>Datewise Sales</h3>
          <Line data={datewiseSalesChartData} />
        </div>
      </div>

      <div style={{ width: "30%", margin: "2rem auto" }}>
        <h3>Revenue Split: Products vs. Book Sets</h3>
        <Pie data={revenueSplitData} />
      </div>

      <h3>Detailed Sales Records</h3>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={{ width: "45%" }}>
          <h4>Product Sales</h4>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {productSales.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>${product.price * product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ width: "45%" }}>
          <h4>Book Set Sales</h4>
          <table>
            <thead>
              <tr>
                <th>Set Name</th>
                <th>Set Price</th>
                <th>Available Quantity</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {bookSetSales.map((bookSet) => (
                <tr key={bookSet._id}>
                  <td>{bookSet.name}</td>
                  <td>${bookSet.setPrice}</td>
                  <td>{bookSet.totalQuantity}</td>
                  <td>${bookSet.setPrice * bookSet.totalQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesInsightsDashboard;
