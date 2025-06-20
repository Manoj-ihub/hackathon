"use client";
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Container,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  useTheme,
  alpha,
  IconButton,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ProductCard from "../../components/ProductCard";

const statusColors = {
  confirmed: "info",
  packed: "warning",
  out_for_delivery: "secondary",
  delivered: "success",
};

const statusIcons = {
  confirmed: <AssignmentIcon />,
  packed: <InventoryIcon />,
  out_for_delivery: <LocalShippingIcon />,
  delivered: <CheckCircleIcon />,
};

const statusLabels = {
  confirmed: "Confirmed",
  packed: "Packed",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const statusFlow = ["confirmed", "packed", "out_for_delivery", "delivered"];

const OrdersCompleted = () => {
  const router = useRouter();
  const theme = useTheme();
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

  const getOrderStats = () => {
    const stats = {
      total: 0,
      confirmed: 0,
      packed: 0,
      out_for_delivery: 0,
      delivered: 0,
    };

    orders.forEach(order => {
      stats.total += order.products.length;
      order.products.forEach(() => {
        stats[order.status] = (stats[order.status] || 0) + 1;
      });
    });

    return stats;
  };

  const stats = getOrderStats();

  const getNextStatusButton = (status) => {
    const currentIndex = statusFlow.indexOf(status);
    const nextStatus = statusFlow[currentIndex + 1];
    
    if (!nextStatus) return null;
    
    return `Mark as ${statusLabels[nextStatus]}`;
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
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
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
              <TrendingUpIcon sx={{ fontSize: 30 }} />
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
                Order Management
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Track and manage your order fulfillment
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: "all 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <StarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
          
          {statusFlow.map((status) => (
            <Grid item xs={12} sm={6} md={2.4} key={status}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette[statusColors[status]].main, 0.1)} 0%, ${alpha(theme.palette[statusColors[status]].main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette[statusColors[status]].main, 0.2)}`,
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: theme.palette[statusColors[status]].main }}>
                    {statusIcons[status]}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color={`${statusColors[status]}.main`}>
                      {stats[status] || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {statusLabels[status]}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

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
              No Orders Found
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              You haven't processed any orders yet. Confirmed orders will appear here.
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
            {orders.map((order, orderIndex) => (
              <Paper
                key={order._id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  overflow: "hidden",
                }}
              >
                {/* Order Header */}
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette[statusColors[order.status]].main, 0.1)} 0%, ${alpha(theme.palette[statusColors[order.status]].main, 0.05)} 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                      <Typography variant="h6" fontWeight="600" mb={1}>
                        Order #{orderIndex + 1}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {order.organizerEmail}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip
                      icon={statusIcons[order.status]}
                      label={statusLabels[order.status]}
                      color={statusColors[order.status]}
                      sx={{
                        fontWeight: 600,
                        px: 2,
                        py: 1,
                        height: "auto",
                      }}
                    />
                  </Stack>

                  {/* Status Stepper */}
                  <Stepper activeStep={statusFlow.indexOf(order.status)} alternativeLabel>
                    {statusFlow.map((status, index) => (
                      <Step key={status} completed={index <= statusFlow.indexOf(order.status)}>
                        <StepLabel
                          StepIconComponent={() => (
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: index <= statusFlow.indexOf(order.status) 
                                  ? theme.palette[statusColors[status]].main 
                                  : alpha(theme.palette.grey[400], 0.5),
                                fontSize: 16,
                              }}
                            >
                              {statusIcons[status]}
                            </Avatar>
                          )}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {statusLabels[status]}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                
                {/* Products List */}
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" mb={3}>
                    Products in this Order
                  </Typography>
                  <Grid container spacing={3}>
                    {order.products.map((item, itemIndex) => (
                      <Grid item xs={12} md={6} lg={4} key={itemIndex}>
                        <Card
                          elevation={0}
                          sx={{
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.1)}`,
                            },
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <ProductCard
                              image={`http://localhost:5000/${item.productId?.image}`}
                              name={item.productId?.name}
                              description={item.productId?.description}
                              price={item.productId?.price}
                              status={order.status}
                            />
                            <Box sx={{ mt: 2, textAlign: "center" }}>
                              <Chip
                                label={`Quantity: ${item.quantity}`}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Action Button */}
                  {order.status !== "delivered" && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      <Box sx={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => handleStatusUpdate(order._id, order.status)}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${theme.palette[statusColors[order.status]].main} 0%, ${theme.palette[statusColors[order.status]].dark} 100%)`,
                            boxShadow: `0 4px 15px ${alpha(theme.palette[statusColors[order.status]].main, 0.3)}`,
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: `0 6px 20px ${alpha(theme.palette[statusColors[order.status]].main, 0.4)}`,
                            },
                          }}
                        >
                          {getNextStatusButton(order.status)}
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default OrdersCompleted;