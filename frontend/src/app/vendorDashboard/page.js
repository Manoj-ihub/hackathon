"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../components/ProductCard";
import axios from "../utils/axiosInstance";
import {
  Box,
  Typography,
  Button,
  Stack,
  Container,
  Paper,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Restaurant as RestaurantIcon,
  TrendingUp as TrendingUpIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const VendorDashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [approvedProducts, setApprovedProducts] = useState([]);
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([])

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const approvedRes = await axios.get(
          `/api/vendor/products/approved?email=${email}`,
          headers
        );
        const rejectedRes = await axios.get(
          `/api/vendor/products/rejected?email=${email}`,
          headers
        );
        const pendingproductres = await axios.get(
          `/api/vendor/products/pending?email=${email}`,
          headers
        )
        setApprovedProducts(approvedRes.data);
        setRejectedProducts(rejectedRes.data);
        setPendingProducts(pendingproductres.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: approvedProducts.length + rejectedProducts.length,
      icon: <RestaurantIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: "Approved",
      value: approvedProducts.length,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
    },
    {
      title: "Rejected",
      value: rejectedProducts.length,
      icon: <CancelIcon />,
      color: theme.palette.error.main,
    },
  ];

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
          <Stack direction="row" alignItems="center" spacing={3} mb={3}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: alpha("#fff", 0.2),
                backdropFilter: "blur(10px)",
              }}
            >
              <RestaurantIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Event Crave
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Your Food Business Dashboard
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="600" mb={1}>
                Welcome back, {name}! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Manage your products and track your business growth
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => router.push("/vendorDashboard/create-product")}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                Create Product
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ReceiptIcon />}
                onClick={() => router.push("/vendorDashboard/view-orders")}
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                View Orders
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={() => router.push("/vendorDashboard/orders-completed")}
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Completed Orders
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 25px ${alpha(stat.color, 0.15)}`,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: stat.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pending Products Section */}
        {pendingProducts.length > 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Box>
              <Typography variant="h5" fontWeight="600" mb={1}>
                 Products Pending Approval
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your products that are waiting for Approval
              </Typography>
            </Box>
            <Chip
              icon={<CheckCircleIcon />}
              label={`${pendingProducts.length} Products`}
              color="success"
              variant="outlined"
            />
          </Stack>
          <Divider sx={{ mb: 3 }} />
          {pendingProducts.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 2,
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
                },
              }}
            >
              {pendingProducts.map((product) => (
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
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                color: "text.secondary",
              }}
            >
              <RestaurantIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" mb={1}>
                Create Your New Product for Approval
              </Typography>
              <Typography variant="body2">
                Create your New Product product to get started!
              </Typography>
            </Box>
          )}
        </Paper>
        ):""
        }

        {/* Approved Products Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Box>
              <Typography variant="h5" fontWeight="600" mb={1}>
                Approved Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your products that are live and available for customers
              </Typography>
            </Box>
            <Chip
              icon={<CheckCircleIcon />}
              label={`${approvedProducts.length} Products`}
              color="success"
              variant="outlined"
            />
          </Stack>
          <Divider sx={{ mb: 3 }} />
          {approvedProducts.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 2,
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
                },
              }}
            >
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
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                color: "text.secondary",
              }}
            >
              <RestaurantIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" mb={1}>
                No approved products yet
              </Typography>
              <Typography variant="body2">
                Create your first product to get started!
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Rejected Products Section */}
        {rejectedProducts.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Box>
                <Typography variant="h5" fontWeight="600" mb={1}>
                  Rejected Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Products that need revision before approval
                </Typography>
              </Box>
              <Chip
                icon={<CancelIcon />}
                label={`${rejectedProducts.length} Products`}
                color="error"
                variant="outlined"
              />
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 2,
                pb: 2,
                "&::-webkit-scrollbar": {
                  height: 8,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: alpha(theme.palette.grey[300], 0.3),
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: alpha(theme.palette.error.main, 0.5),
                  borderRadius: 4,
                },
              }}
            >
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
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default VendorDashboard;