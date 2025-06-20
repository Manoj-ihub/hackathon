"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Button
} from "@mui/material";
import axios from "../../utils/axiosInstance";

const ApprovalsPage = () => {
  const token = localStorage.getItem("token");
  const [pendingProducts, setPendingProducts] = useState([]);

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("/api/admin/products/pending", headers);
        setPendingProducts(res.data);
      } catch (err) {
        console.error("Error fetching pending products:", err);
      }
    };

    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.patch(`/api/admin/products/${id}/${action}`, {}, headers);
      setPendingProducts(prev => prev.filter(product => product._id !== id));
    } catch (err) {
      console.error(`Failed to ${action} product`, err);
      alert("Something went wrong");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Pending Product Approvals</Typography>
      {pendingProducts.length === 0 ? (
        <Typography>No pending products.</Typography>
      ) : (
        <Stack spacing={2}>
          {pendingProducts.map((product) => (
            <Card key={product._id} sx={{ display: "flex", alignItems: "center" }}>
              <CardMedia
                component="img"
                image={`http://localhost:5000/${product.image}`}
                alt={product.name}
                sx={{ width: 120, height: 120, objectFit: "cover", m: 1 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography fontWeight="bold">{product.name}</Typography>
                <Typography>{product.description}</Typography>
                <Typography>Price: ₹{product.price}</Typography>
                <Typography variant="caption">Vendor: {product.vendorEmail}</Typography>
              </CardContent>
              <Stack direction="row" spacing={1} pr={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleAction(product._id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleAction(product._id, "rejected")}
                >
                  Reject
                </Button>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ApprovalsPage;
