"use client";
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import ProductCard from "../../components/ProductCard";

const statusColors = {
  confirmed: "info",
  packed: "warning",
  out_for_delivery: "secondary",
  delivered: "success",
};

const statusFlow = ["confirmed", "packed", "out_for_delivery", "delivered"];

const OrdersCompleted = () => {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/vendor/my-orders?email=${email}`, headers);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = statusFlow[currentIndex + 1];

    if (!nextStatus) return;

    try {
      await axios.patch(
        `/api/vendor/order-status/${orderId}`,
        { status: nextStatus },
        headers
      );
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: nextStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>Your Processed Orders</Typography>

      {orders.length === 0 ? (
        <Typography>No orders confirmed yet.</Typography>
      ) : (
        <Stack spacing={3}>
          {orders.map(order =>
            order.products.map((item, index) => (
              <Box key={index} sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <ProductCard
                    image={`http://localhost:5000/${item.productId?.image}`}
                    name={item.productId?.name}
                    description={item.productId?.description}
                    price={item.productId?.price}
                    status={order.status}
                  />
                  <Stack spacing={1} alignItems="flex-end">
                    <Chip label={order.status} color={statusColors[order.status]} />
                    {order.status !== "delivered" && (
                      <Button
                        variant="contained"
                        onClick={() => handleStatusUpdate(order._id, order.status)}
                        size="small"
                      >
                        Mark as {statusFlow[statusFlow.indexOf(order.status) + 1]}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))
          )}
        </Stack>
      )}
    </Box>
  );
};

export default OrdersCompleted;
