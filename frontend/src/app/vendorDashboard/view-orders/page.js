"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Stack } from "@mui/material";
import axios from "../../utils/axiosInstance";

const ViewOrders = () => {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/vendor/orders/pending?email=${email}`, headers);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirm = async (orderId) => {
    try {
      await axios.patch(`/api/vendor/orders/${orderId}/confirm`, {
        vendorEmail: email
      }, headers);

      setOrders(prev => prev.filter(order => order._id !== orderId));
      alert("Order confirmed");
    } catch (err) {
      console.error("Failed to confirm order", err);
      alert("Something went wrong");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Pending Orders</Typography>

      {orders.length === 0 ? (
        <Typography>No pending orders.</Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Card key={order._id} sx={{ backgroundColor: "#f9f9f9" }}>
              <CardContent>
                <Typography fontWeight="bold">
                  Organizer: {order.organizerEmail}
                </Typography>
                <Typography>Status: {order.status}</Typography>

                <Box mt={1}>
                  <Typography fontWeight="medium">Products:</Typography>
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

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => handleConfirm(order._id)}
                >
                  Confirm Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ViewOrders;