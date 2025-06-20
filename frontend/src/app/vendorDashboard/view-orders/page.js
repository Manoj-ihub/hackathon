"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Container,
  Paper,
  Avatar,
  Chip,
  Grid,
  Divider,
  useTheme,
  alpha,
  IconButton,
  Badge,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Restaurant as RestaurantIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "../../utils/axiosInstance";

const ViewOrders = () => {
  const router = useRouter();
  const theme = useTheme();
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
      // You might want to use a proper notification system instead of alert
      alert("Order confirmed successfully!");
    } catch (err) {
      console.error("Failed to confirm order", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const getTotalItems = (products) => {
    return products.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = (products) => {
    return products.reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
            p: 4,
            mb: 4,
            borderRadius: 3,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "200px",
              height: "200px",
              background: `radial-gradient(circle, ${alpha("#fff", 0.1)} 0%, transparent 70%)`,
              transform: "translate(50%, -50%)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={3} mb={2}>
            <IconButton
              onClick={() => router.back()}
              sx={{
                bgcolor: alpha("#fff", 0.2),
                color: "white",
                "&:hover": {
                  bgcolor: alpha("#fff", 0.3),
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: alpha("#fff", 0.2),
                backdropFilter: "blur(10px)",
              }}
            >
              <AssignmentIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Pending Orders
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Review and confirm your incoming orders
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: alpha("#fff", 0.15),
                px: 3,
                py: 1.5,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
              }}
            >
              <Badge badgeContent={orders.length} color="secondary">
                <ShoppingCartIcon sx={{ mr: 1 }} />
              </Badge>
              <Typography variant="h6" fontWeight="600" sx={{ ml: 1 }}>
                {orders.length} Orders Pending
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Orders Content */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Loading orders...
            </Typography>
          </Box>
        ) : orders.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
            }}
          >
            <AssignmentIcon
              sx={{
                fontSize: 80,
                color: alpha(theme.palette.primary.main, 0.3),
                mb: 2,
              }}
            />
            <Typography variant="h5" fontWeight="600" mb={2}>
              No Pending Orders
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              All caught up! New orders will appear here when customers place them.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/vendorDashboard")}
              sx={{ borderRadius: 2 }}
            >
              Back to Dashboard
            </Button>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {orders.map((order, index) => (
              <Card
                key={order._id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.1)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Order Header */}
                  <Box
                    sx={{
                      p: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            Order #{index + 1}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {order.organizerEmail}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                      <Chip
                        icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                        label={order.status}
                        color="warning"
                        variant="outlined"
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>

                    {/* Order Summary */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="h5" fontWeight="bold" color="info.main">
                            {getTotalItems(order.products)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total Items
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="h5" fontWeight="bold" color="success.main">
                            ₹{getTotalAmount(order.products)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total Amount
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="h5" fontWeight="bold" color="primary.main">
                            {order.products.length}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Product Types
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Products List */}
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" mb={2}>
                      Products Ordered
                    </Typography>
                    <Stack spacing={2}>
                      {order.products.map((item, itemIndex) => (
                        <Box
                          key={itemIndex}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            bgcolor: alpha(theme.palette.grey[100], 0.5),
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          }}
                        >
                          <Avatar
                            src={`http://localhost:5000/${item.productId?.image}`}
                            alt={item.productId?.name}
                            sx={{
                              width: 60,
                              height: 60,
                              mr: 2,
                              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            }}
                          >
                            <RestaurantIcon />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              {item.productId?.name || "Unknown Product"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Unit Price: ₹{item.productId?.price || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Chip
                              label={`Qty: ${item.quantity}`}
                              color="primary"
                              variant="outlined"
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                              ₹{(item.productId?.price || 0) * item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    {/* Action Button */}
                    <Box sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleConfirm(order._id)}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                          boxShadow: `0 4px 15px ${alpha(theme.palette.success.main, 0.3)}`,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.4)}`,
                          },
                        }}
                      >
                        Confirm Order
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default ViewOrders;