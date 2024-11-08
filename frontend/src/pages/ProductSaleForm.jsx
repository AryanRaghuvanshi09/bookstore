import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import API from "../services/api";

const ProductSaleForm = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = products.filter((product) =>
      `${product.name} ${product.category}`.toLowerCase().includes(searchValue)
    );
    setFilteredProducts(filtered);
  };

  const handleProductSelection = (e) => {
    const selectedId = e.target.value;
    setSelectedProduct(selectedId);

    const product = products.find((product) => product._id === selectedId);
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);

    const product = products.find((product) => product._id === selectedProduct);
    if (product) {
      setTotalPrice(product.price * newQuantity);
    }
  };

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

      const product = products.find((p) => p._id === selectedProduct);
      const invoiceData = {
        productName: product.name,
        quantity,
        pricePerUnit: product.price,
        totalPrice,
        date: new Date().toLocaleDateString(),
      };

      setInvoice(invoiceData);
      generatePDF(invoiceData);

      alert(response.data.message);
    } catch (error) {
      console.error("Error processing product sale:", error);
      alert("Product sale failed.");
    }
  };

  const generatePDF = (invoiceData) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${invoiceData.date}`, 20, 30);
    doc.text(`Product: ${invoiceData.productName}`, 20, 40);
    doc.text(`Quantity: ${invoiceData.quantity}`, 20, 50);
    doc.text(`Price per Unit: $${invoiceData.pricePerUnit}`, 20, 60);
    doc.text(`Total Price: $${invoiceData.totalPrice}`, 20, 70);

    doc.save("invoice.pdf"); // Save the PDF as "invoice.pdf"
  };

  return (
    <div>
      <h2>Product Sale</h2>
      <form onSubmit={handleProductSale}>
        <label>Search Product:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or category"
        />

        <label>Select Product:</label>
        <select value={selectedProduct} onChange={handleProductSelection}>
          <option value="">--Select Product--</option>
          {filteredProducts.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name} - ${product.price}
            </option>
          ))}
        </select>

        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
        />

        <div>
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        </div>

        <button type="submit">Sell Product</button>
      </form>

      {/* Display invoice information if generated */}
      {invoice && (
        <div>
          <h3>Invoice</h3>
          <p>Product: {invoice.productName}</p>
          <p>Quantity: {invoice.quantity}</p>
          <p>Price per Unit: ${invoice.pricePerUnit}</p>
          <p>Total Price: ${invoice.totalPrice}</p>
          <p>Date: {invoice.date}</p>

          {/* Option to download PDF again if needed */}
          <button onClick={() => generatePDF(invoice)}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default ProductSaleForm;
