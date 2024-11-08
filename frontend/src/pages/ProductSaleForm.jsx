import React, { useState, useEffect } from "react";
import API from "../services/api";

const ProductSaleForm = () => {
  const [products, setProducts] = useState([]); // Store products list
  const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products for search
  const [searchTerm, setSearchTerm] = useState(""); // Store search term
  const [selectedProduct, setSelectedProduct] = useState(""); // Selected product
  const [quantity, setQuantity] = useState(1); // Quantity to sell
  const [totalPrice, setTotalPrice] = useState(0); // Store the total price

  // Fetch products when component loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products"); // Fetch available products
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filteredProducts
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle search input change and filter products
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter products based on search term (by name or category)
    const filtered = products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(searchValue)
    );
    setFilteredProducts(filtered);
  };

  // Handle product selection and update the total price
  const handleProductSelection = (e) => {
    const selectedId = e.target.value;
    setSelectedProduct(selectedId);

    const product = products.find((product) => product._id === selectedId);
    if (product) {
      setTotalPrice(product.price * quantity); // Calculate total price
    }
  };

  // Handle quantity change and update the total price
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);

    const product = products.find((product) => product._id === selectedProduct);
    if (product) {
      setTotalPrice(product.price * newQuantity); // Update total price
    }
  };

  // Handle product sale
  const handleProductSale = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity) {
      alert("Please select a product and quantity.");
      return;
    }

    try {
      const response = await API.post("/sales/product", {
        productId: selectedProduct,
        quantity,
      });
      alert(response.data.message); // Show success message
    } catch (error) {
      console.error("Error processing product sale:", error);
      alert("Product sale failed.");
    }
  };

  return (
    <div>
      <h2>Product Sale</h2>
      <form onSubmit={handleProductSale}>
        {/* Search Input */}
        <label>Search Product:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or category"
        />

        {/* Select Product */}
        <label>Select Product:</label>
        <select value={selectedProduct} onChange={handleProductSelection}>
          <option value="">--Select Product--</option>
          {filteredProducts.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - ${product.price}
            </option>
          ))}
        </select>

        {/* Quantity */}
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
        />

        {/* Total Price */}
        <div>
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        </div>

        {/* Submit Button */}
        <button type="submit">Sell Product</button>
      </form>
    </div>
  );
};

export default ProductSaleForm;
