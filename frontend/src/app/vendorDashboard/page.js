"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../components/ProductCard";
import axios from "../utils/axiosInstance";
import { Box, Typography, Button, Stack } from "@mui/material";

const VendorDashboard = () => {
  const router = useRouter();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [approvedProducts, setApprovedProducts] = useState([]);
  const [rejectedProducts, setRejectedProducts] = useState([]);

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const approvedRes = await axios.get(
          `/api/vendor/products/approved?email=${email}`,
          headers
        );
        const rejectedRes = await axios.get(
          `/api/vendor/products/rejected?email=${email}`,
          headers
        );
        setApprovedProducts(approvedRes.data);
        setRejectedProducts(rejectedRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box p={3}>
      {/* Top Bar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Hello, {name}</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => router.push("/vendorDashboard/create-product")}
          >
            + Create Product
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/vendorDashboard/view-orders")}
          >
            View Orders
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/vendorDashboard/orders-completed")}
          >
            Orders Completed
          </Button>
        </Stack>
      </Stack>

      {/* Approved Products */}
      <Typography variant="subtitle1" mb={1}>
        Your Approved Products
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        {approvedProducts.map((product) => (
          <ProductCard
            key={product._id}
            image={`http://localhost:5000/${product.image}`}
            name={product.name}
            description={product.description}
            price={product.price}
            status={product.status}
          />
        ))}
      </Box>

      {/* Rejected Products */}
      <Typography variant="subtitle1" mt={4} mb={1}>
        Your Rejected Products
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        {rejectedProducts.map((product) => (
          <ProductCard
            key={product._id}
            image={`http://localhost:5000/${product.image}`}
            name={product.name}
            description={product.description}
            price={product.price}
            status={product.status}
          />
        ))}
      </Box>
    </Box>
  );
};

export default VendorDashboard;
