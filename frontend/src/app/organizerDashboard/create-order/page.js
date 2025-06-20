"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent
} from "@mui/material";
import axios from "../../utils/axiosInstance";

const CreateOrder = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/organizer/products/recent", headers);
        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (id, value) => {
    setQuantities(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async () => {
    const orderItems = Object.entries(quantities)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([productId, quantity]) => ({
        productId,
        quantity: Number(quantity)
      }));

    if (orderItems.length === 0) {
      alert("Please enter at least one quantity");
      return;
    }

    try {
      await axios.post("/api/organizer/orders", {
        organizerEmail: email,
        products: orderItems
      }, headers);

      alert("Order placed successfully");
      setQuantities({});
    } catch (err) {
      console.error("Order failed", err);
      alert("Something went wrong");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Create Order</Typography>
      <Stack spacing={2}>
        {products.map((product) => (
          <Card key={product._id} sx={{ display: "flex", alignItems: "center" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography fontWeight="bold">{product.name}</Typography>
              <Typography>{product.description}</Typography>
              <Typography>Price: ₹{product.price}</Typography>
            </CardContent>
            <Box px={2}>
              <TextField
                label="Quantity"
                type="number"
                size="small"
                value={quantities[product._id] || ""}
                onChange={(e) => handleChange(product._id, e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Box>
          </Card>
        ))}
      </Stack>
      <Box mt={3}>
        <Button variant="contained" onClick={handleSubmit}>
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default CreateOrder;
