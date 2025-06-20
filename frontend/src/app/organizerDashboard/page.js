"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "../utils/axiosInstance";
import ProductCard from "../components/ProductCard";

const OrganizerDashboard = () => {
  const router = useRouter();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [recentProducts, setRecentProducts] = useState([]);
  const [lastOrders, setLastOrders] = useState([]);

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get("/api/organizer/products/recent", headers);
        const res2 = await axios.get(
          `/api/organizer/orders?email=${email}`,
          headers
        );
        setRecentProducts(res1.data);
        setLastOrders(res2.data);
      } catch (err) {
        console.error("Error fetching organizer data", err);
      }
    };

    fetchData();
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
            onClick={() => router.push("/organizerDashboard/create-order")}
          >
            Create Order
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/organizerDashboard/orders")}
          >
            Your Orders
          </Button>
        </Stack>
      </Stack>

      {/* Recent Products */}
      <Typography variant="subtitle1" mb={1}>
        Recent Products
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto", pb: 2 }}>
        {recentProducts.map((product) => (
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

      {/* Last Purchase */}
      <Typography variant="subtitle1" mt={4} mb={1}>
        Your Last Purchase
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        {lastOrders.map((order) => (
          <Box
            key={order._id}
            sx={{
              mr: 2,
              minWidth: 250,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
            }}
          >
            <Typography fontWeight="bold">Status: {order.status}</Typography>
            <Typography variant="body2" mb={1}>
              Order ID: {order._id}
            </Typography>
            <Typography variant="body2">Products:</Typography>
            <ul>
              {order.products.map((item, index) => (
                <li key={index}>
                  <img
                    src={`http://localhost:5000/${item.productId?.image}`}
                    alt={item.productId?.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      marginRight: 8,
                    }}
                  />
                  {item.productId?.name} — Qty: {item.quantity}
                </li>
              ))}
            </ul>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrganizerDashboard;
