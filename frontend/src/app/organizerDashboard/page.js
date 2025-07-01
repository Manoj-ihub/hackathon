"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Badge,
  useTheme,
  alpha,
  Fade,
  Skeleton,
  CardMedia,
} from "@mui/material";
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Event as EventIcon,
  Restaurant as RestaurantIcon,
  TrendingUp as TrendingUpIcon,
  LocalOffer as LocalOfferIcon,
  AccessTime as AccessTimeIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "../utils/axiosInstance";
import ProductCard from "../components/ProductCard";

const OrganizerDashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [recentProducts, setRecentProducts] = useState([]);
  const [lastOrders, setLastOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [res2] = await Promise.all([
          axios.get(`/api/organizer/orders?email=${email}`, headers),
        ]);
        setLastOrders(res2.data);
      } catch (err) {
        console.error("Error fetching organizer data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
    
         async (position) => {
    
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
    
            try {
            const res = await axios.get(`/api/organizer/products/recent?latitude=${lat}&longitude=${lon}`, headers);
            setRecentProducts(res.data);
          } catch (err) {
            console.error("Error loading products:", err);
            setSnackbar({ open: true, message: "Failed to load products", severity: "error" });
          }
    
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Please allow location access to create a product.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }



  }, []);

  const getOrderStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          color: "success",
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
          bgColor: alpha(theme.palette.success.main, 0.1),
        };
      case "pending":
        return {
          color: "warning",
          icon: <PendingIcon sx={{ fontSize: 16 }} />,
          bgColor: alpha(theme.palette.warning.main, 0.1),
        };
      case "cancelled":
        return {
          color: "error",
          icon: <CancelIcon sx={{ fontSize: 16 }} />,
          bgColor: alpha(theme.palette.error.main, 0.1),
        };
      default:
        return {
          color: "primary",
          icon: <AccessTimeIcon sx={{ fontSize: 16 }} />,
          bgColor: alpha(theme.palette.primary.main, 0.1),
        };
    }
  };

  const quickStats = [
    {
      title: "Available Products",
      value: recentProducts.length,
      icon: <RestaurantIcon />,
      color: theme.palette.primary.main,
      trend: "Fresh items",
    },
    {
      title: "Total Orders",
      value: lastOrders.length,
      icon: <ShoppingCartIcon />,
      color: theme.palette.success.main,
      trend: "Order history",
    },
    {
      title: "Quick Actions",
      value: "2",
      icon: <SpeedIcon />,
      color: theme.palette.info.main,
      trend: "Ready to use",
    },
  ];

  const LoadingSkeleton = ({ type = "product" }) => {
    if (type === "stats") {
      return (
        <Grid container spacing={3} mb={4}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (type === "orders") {
      return (
        <Stack direction="row" spacing={3} sx={{ overflowX: "auto", pb: 2 }}>
          {[...Array(3)].map((_, index) => (
            <Paper key={index} sx={{ minWidth: 350, p: 3, borderRadius: 3 }}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 2 }} />
              <Skeleton variant="text" height={24} width="60%" />
              <Skeleton variant="text" height={20} width="80%" />
            </Paper>
          ))}
        </Stack>
      );
    }

    return (
      <Stack direction="row" spacing={3} sx={{ overflowX: "auto", pb: 2 }}>
        {[...Array(4)].map((_, index) => (
          <Paper key={index} sx={{ minWidth: 280, borderRadius: 3, overflow: "hidden" }}>
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ p: 3 }}>
              <Skeleton variant="text" height={32} width="80%" />
              <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={20} width="60%" />
            </Box>
          </Paper>
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
      {/* Hero Header */}
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          borderRadius: 0,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "300px",
            background: `radial-gradient(circle, ${alpha("#fff", 0.1)} 0%, transparent 70%)`,
            transform: "translate(50%, -50%)",
          },
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 6 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={4}
            >
              {/* Welcome Section */}
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: alpha("#fff", 0.2),
                    backdropFilter: "blur(10px)",
                    fontSize: "2rem",
                  }}
                >
                  <EventIcon sx={{ fontSize: 35 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="800"
                    sx={{
                      background: "linear-gradient(45deg, #fff, #e3f2fd)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    Event Organizer
                  </Typography>
                  <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                    Welcome back, {name}! 🎉
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Manage your events and create amazing food experiences
                  </Typography>
                </Box>
              </Stack>

              {/* Action Buttons */}
              <Stack direction={{ xs: "row", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => router.push("/organizerDashboard/create-order")}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.3)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Create Order
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ReceiptIcon />}
                  onClick={() => router.push("/organizerDashboard/orders")}
                  sx={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "white",
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Your Orders
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Quick Stats */}
        {loading ? (
          <LoadingSkeleton type="stats" />
        ) : (
          <Fade in={!loading} timeout={800}>
            <Grid container spacing={3} mb={6}>
              {quickStats.map((stat, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                      border: `1px solid ${alpha(stat.color, 0.2)}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: `0 20px 40px ${alpha(stat.color, 0.15)}`,
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "100px",
                        height: "100px",
                        background: `radial-gradient(circle, ${alpha(stat.color, 0.1)} 0%, transparent 70%)`,
                        transform: "translate(50%, -50%)",
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={3}>
                      <Avatar
                        sx={{
                          bgcolor: stat.color,
                          width: 60,
                          height: 60,
                          boxShadow: `0 8px 25px ${alpha(stat.color, 0.3)}`,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="800" color={stat.color} sx={{ mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 0.5 }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.trend}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}

        {/* Recent Products Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <RestaurantIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                <Typography variant="h5" fontWeight="700" color="text.primary">
                  Fresh Menu Items
                </Typography>
                <Chip
                  icon={<StarIcon sx={{ fontSize: 16 }} />}
                  label="Recently Added"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Discover the latest food items available for your events
              </Typography>
            </Box>
            <IconButton
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
              }}
            >
              <VisibilityIcon sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

          {loading ? (
            <LoadingSkeleton />
          ) : recentProducts.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 3,
                pb: 2,
                "&::-webkit-scrollbar": {
                  height: 8,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: alpha(theme.palette.grey[300], 0.3),
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                  borderRadius: 4,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
              }}
            >
              {recentProducts.map((product, index) => (
                <Fade in timeout={600} style={{ transitionDelay: `${index * 100}ms` }} key={product._id}>
                  <div>
                    <ProductCard
                      image={`http://localhost:5000/${product.image}`}
                      name={product.name}
                      description={product.description}
                      price={product.price}
                      status={product.status}
                    />
                  </div>
                </Fade>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <RestaurantIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" fontWeight="600" mb={1}>
                No recent products available
              </Typography>
              <Typography variant="body2">
                Check back later for fresh menu items!
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Orders History Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <TimelineIcon sx={{ color: theme.palette.success.main, fontSize: 28 }} />
                <Typography variant="h5" fontWeight="700" color="text.primary">
                  Recent Orders
                </Typography>
                <Badge badgeContent={lastOrders.length} color="success">
                  <ShoppingCartIcon sx={{ color: theme.palette.success.main }} />
                </Badge>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Track your order history and manage your purchases
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.success.main, 0.1) }} />

          {loading ? (
            <LoadingSkeleton type="orders" />
          ) : lastOrders.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 3,
                pb: 2,
                "&::-webkit-scrollbar": {
                  height: 8,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: alpha(theme.palette.grey[300], 0.3),
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: alpha(theme.palette.success.main, 0.5),
                  borderRadius: 4,
                  "&:hover": {
                    backgroundColor: theme.palette.success.main,
                  },
                },
              }}
            >
              {lastOrders.map((order, index) => {
                const statusConfig = getOrderStatusConfig(order.status);
                return (
                  <Fade in timeout={600} style={{ transitionDelay: `${index * 150}ms` }} key={order._id}>
                    <Card
                      elevation={0}
                      sx={{
                        minWidth: 350,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: `0 12px 30px ${alpha(theme.palette.common.black, 0.1)}`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box>
                            <Typography variant="h6" fontWeight="700" mb={1}>
                              Order #{order._id.slice(-6)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.products?.length || 0} items
                            </Typography>
                          </Box>
                          <Chip
                            icon={statusConfig.icon}
                            label={order.status}
                            color={statusConfig.color}
                            size="small"
                            sx={{
                              bgcolor: statusConfig.bgColor,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          />
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {order.products && order.products.length > 0 ? (
                          <Stack spacing={2}>
                            {order.products.slice(0, 2).map((item, idx) => (
                              <Stack direction="row" alignItems="center" spacing={2} key={idx}>
                                <Avatar
                                  src={`http://localhost:5000/${item.productId?.image}`}
                                  alt={item.productId?.name}
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  }}
                                >
                                  <RestaurantIcon />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" fontWeight="600" noWrap>
                                    {item.productId?.name || "Unknown Product"}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Quantity: {item.quantity}
                                  </Typography>
                                </Box>
                              </Stack>
                            ))}
                            {order.products.length > 2 && (
                              <Typography variant="caption" color="primary" textAlign="center">
                                +{order.products.length - 2} more items
                              </Typography>
                            )}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                            No items in this order
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Fade>
                );
              })}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" fontWeight="600" mb={1}>
                No orders yet
              </Typography>
              <Typography variant="body2" mb={3}>
                Start creating your first order to see it here!
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/organizerDashboard/create-order")}
                sx={{ borderRadius: 3 }}
              >
                Create Your First Order
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default OrganizerDashboard;