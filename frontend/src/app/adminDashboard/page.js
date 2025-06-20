"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "../utils/axiosInstance";
import ProductCard from "../components/ProductCard";

const AdminDashboard = () => {
  const router = useRouter();
  const name = localStorage.getItem("name");
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
          "/api/admin/products/approved",
          headers
        );
        const rejectedRes = await axios.get(
          "/api/admin/products/rejected",
          headers
        );
        setApprovedProducts(approvedRes.data);
        setRejectedProducts(rejectedRes.data);
      } catch (error) {
        console.error("Error fetching products:", error);
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
            variant="outlined"
            onClick={() => router.push("/adminDashboard/approvals")}
          >
            Products Approval
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/adminDashboard/vendors")}
          >
            View All Vendors
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/adminDashboard/organizers")}
          >
            View All Organizers
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/adminDashboard/products")}
          >
            View All Products
          </Button>
        </Stack>
      </Stack>

      {/* Approved Products */}
      <Typography variant="subtitle1" mb={1}>
        Approved Products
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto", pb: 2 }}>
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
        Rejected Products
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

export default AdminDashboard;
