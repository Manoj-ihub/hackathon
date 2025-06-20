"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent
} from "@mui/material";
import axios from "../../utils/axiosInstance";

const OrganizerOrders = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const [orders, setOrders] = useState([]);

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/organizer/orders?email=${email}`, headers);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Your Orders</Typography>

      {orders.length === 0 ? (
        <Typography>No orders placed yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Card key={order._id}>
              <CardContent>
                <Typography fontWeight="bold">Order ID: {order._id}</Typography>
                <Typography>Status: {order.status}</Typography>
                <Typography variant="body2" mb={1}>
                  Vendor: {order.vendorEmail || "Not yet confirmed"}
                </Typography>
                <Typography variant="body2">Products:</Typography>
                <ul>
                  {order.products.map((item, index) => (
                    <li key={index}>
                      Product ID: {item.productId?.name}, Qty: {item.quantity}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default OrganizerOrders;
