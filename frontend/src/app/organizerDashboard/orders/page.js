"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Paper,
  Chip,
  Avatar,
  Grid,
  Divider,
  IconButton,
  CircularProgress,
  Container,
  Badge,
  Fade,
  Zoom
} from "@mui/material";
import {
  ShoppingBag,
  AccessTime,
  CheckCircle,
  Restaurant,
  LocalShipping,
  Visibility,
  Person,
  Email
} from "@mui/icons-material";
import axios from "../../utils/axiosInstance";

const OrganizerOrders = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { color: 'warning', icon: <AccessTime />, bg: '#fff3e0' };
      case 'confirmed':
        return { color: 'info', icon: <CheckCircle />, bg: '#e3f2fd' };
      case 'preparing':
        return { color: 'secondary', icon: <Restaurant />, bg: '#f3e5f5' };
      case 'ready':
        return { color: 'success', icon: <CheckCircle />, bg: '#e8f5e8' };
      case 'delivered':
        return { color: 'default', icon: <LocalShipping />, bg: '#f5f5f5' };
      default:
        return { color: 'default', icon: <AccessTime />, bg: '#f5f5f5' };
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}
        >
          <CircularProgress size={60} sx={{ mb: 3, color: '#667eea' }} />
          <Typography variant="h6" color="text.secondary">
            Loading your orders...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={20}
            sx={{
              mb: 4,
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)'
              }}
            >
              <ShoppingBag sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Your Orders
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Track and manage all your food orders in one place
            </Typography>
          </Paper>
        </Fade>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Fade in timeout={1000}>
            <Paper
              elevation={16}
              sx={{
                p: 8,
                textAlign: 'center',
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}
              >
                <ShoppingBag sx={{ fontSize: 60, color: '#9e9e9e' }} />
              </Avatar>
              <Typography variant="h4" color="text.secondary" gutterBottom>
                No orders placed yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start browsing our delicious menu and place your first order!
              </Typography>
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <Grid item xs={12} lg={6} key={order._id}>
                  <Zoom in timeout={600 + (index * 200)}>
                    <Card
                      elevation={16}
                      sx={{
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                          '& .order-header': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }
                        }
                      }}
                    >
                      {/* Order Header */}
                      <Box
                        className="order-header"
                        sx={{
                          background: 'linear-gradient(135deg, #6c7b8a 0%, #667eea 100%)',
                          color: 'white',
                          p: 3,
                          transition: 'all 0.4s ease'
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                              <ShoppingBag />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            icon={statusConfig.icon}
                            label={order.status?.toUpperCase() || 'PENDING'}
                            color={statusConfig.color}
                            sx={{
                              fontWeight: 'bold',
                              bgcolor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              '& .MuiChip-icon': { color: 'white' }
                            }}
                          />
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={1}>
                          <Person sx={{ fontSize: 18 }} />
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {order.vendorEmail || "Vendor not yet confirmed"}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        {/* Products Section */}
                        <Box mb={3}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              color: '#667eea',
                              fontWeight: 700
                            }}
                          >
                            <Restaurant />
                            Order Items
                            <Badge
                              badgeContent={order.products?.length || 0}
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                          
                          <Stack spacing={2}>
                            {order.products?.map((item, idx) => (
                              <Paper
                                key={idx}
                                elevation={2}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  background: statusConfig.bg,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateX(8px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                                  }
                                }}
                              >
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Avatar
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      borderRadius: 2,
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                    src={`http://localhost:5000/${item.productId?.image}`}
                                  >
                                    <Restaurant />
                                  </Avatar>
                                  <Box flex={1}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {item.productId?.name || 'Product'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Quantity: {item.quantity}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={`×${item.quantity}`}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold' }}
                                  />
                                </Box>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Action Button */}
                        <Box textAlign="center">
                          <IconButton
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              width: 60,
                              height: 60,
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                transform: 'scale(1.1)',
                                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)'
                              },
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            View Details
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default OrganizerOrders;