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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Groups as GroupsIcon,
  Event as EventIcon,
  Inventory as InventoryIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const AdminDashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const [approvedProducts, setApprovedProducts] = useState([]);
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [approvedRes, rejectedRes, pendingRes] = await Promise.all([
        axios.get("/api/admin/products/approved", headers),
        axios.get("/api/admin/products/rejected", headers),
        axios.get("/api/admin/products/pending", headers),
      ]);
      
      setApprovedProducts(approvedRes.data);
      setRejectedProducts(rejectedRes.data);
      setPendingProducts(pendingRes.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuickAction = async (id, action) => {
    setProcessingIds(prev => new Set(prev).add(id));
    
    try {
      await axios.patch(`/api/admin/products/${id}/${action}`, {}, headers);
      // Refresh the data after action
      await fetchProducts();
    } catch (err) {
      console.error(`Failed to ${action} product`, err);
      alert("Something went wrong");
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const stats = [
    {
      title: "Total Products",
      value: approvedProducts.length + rejectedProducts.length + pendingProducts.length,
      icon: <InventoryIcon />,
      color: theme.palette.primary.main,
      description: "All products in system",
    },
    {
      title: "Approved",
      value: approvedProducts.length,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
      description: "Live products",
    },
    {
      title: "Pending",
      value: pendingProducts.length,
      icon: <ScheduleIcon />,
      color: theme.palette.warning.main,
      description: "Awaiting review",
    },
    {
      title: "Rejected",
      value: rejectedProducts.length,
      icon: <CancelIcon />,
      color: theme.palette.error.main,
      description: "Need revision",
    },
  ];

  const quickActions = [
    {
      title: "Products Approval",
      description: "Review and approve pending products",
      icon: <AssignmentIcon />,
      color: theme.palette.warning.main,
      count: pendingProducts.length,
      onClick: () => router.push("/adminDashboard/approvals"),
    },
    {
      title: "View All Vendors",
      description: "Manage vendor accounts and permissions",
      icon: <GroupsIcon />,
      color: theme.palette.info.main,
      onClick: () => router.push("/adminDashboard/vendors"),
    },
    {
      title: "View All Organizers",
      description: "Manage event organizer accounts",
      icon: <EventIcon />,
      color: theme.palette.secondary.main,
      onClick: () => router.push("/adminDashboard/organizers"),
    },
    {
      title: "View All Products",
      description: "Complete product catalog overview",
      icon: <InventoryIcon />,
      color: theme.palette.primary.main,
      count: approvedProducts.length + rejectedProducts.length + pendingProducts.length,
      onClick: () => router.push("/adminDashboard/products"),
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
              width: "300px",
              height: "300px",
              background: `radial-gradient(circle, ${alpha("#fff", 0.1)} 0%, transparent 70%)`,
              transform: "translate(50%, -50%)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "200px",
              height: "200px",
              background: `radial-gradient(circle, ${alpha("#fff", 0.05)} 0%, transparent 70%)`,
              transform: "translate(-50%, 50%)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={3} mb={3}>
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: alpha("#fff", 0.2),
                backdropFilter: "blur(10px)",
                border: `2px solid ${alpha("#fff", 0.3)}`,
              }}
            >
              <AdminIcon sx={{ fontSize: 35 }} />
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
                Event Crave Admin
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Administrative Control Center
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", lg: "center" }}
            spacing={3}
          >
            <Box>
              <Typography variant="h4" fontWeight="700" mb={1}>
                Welcome back, {name}! 👨‍💼
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85, fontSize: "1.1rem" }}>
                Monitor platform activity and manage system operations
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  bgcolor: alpha("#fff", 0.1),
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha("#fff", 0.2)}`,
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <DashboardIcon sx={{ fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    System Status
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    All Systems Operational
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={fetchProducts}
                  disabled={loading}
                  sx={{
                    bgcolor: alpha("#fff", 0.1),
                    color: "white",
                    "&:hover": {
                      bgcolor: alpha("#fff", 0.2),
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 12px 30px ${alpha(stat.color, 0.2)}`,
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "80px",
                    height: "80px",
                    background: `radial-gradient(circle, ${alpha(stat.color, 0.1)} 0%, transparent 70%)`,
                    transform: "translate(50%, -50%)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Avatar
                    sx={{
                      bgcolor: stat.color,
                      width: 64,
                      height: 64,
                      boxShadow: `0 4px 12px ${alpha(stat.color, 0.3)}`,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h3" fontWeight="bold" color={stat.color} mb={0.5}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" fontWeight="600" color="text.primary" mb={0.5}>
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.description}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            background: `linear-gradient(135deg, ${alpha("#fff", 0.8)} 0%, ${alpha("#fff", 0.95)} 100%)`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 48,
                height: 48,
              }}
            >
              <DashboardIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="600" mb={0.5}>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Frequently used administrative functions
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    background: `linear-gradient(135deg, ${alpha(action.color, 0.05)} 0%, ${alpha(action.color, 0.02)} 100%)`,
                    border: `1px solid ${alpha(action.color, 0.1)}`,
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 25px ${alpha(action.color, 0.15)}`,
                      borderColor: action.color,
                    },
                  }}
                  onClick={action.onClick}
                >
                  <Stack spacing={2}>
                    <Box sx={{ position: "relative", alignSelf: "flex-start" }}>
                      <Avatar
                        sx={{
                          bgcolor: action.color,
                          width: 48,
                          height: 48,
                          mb: 1,
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      {action.count !== undefined && action.count > 0 && (
                        <Chip
                          label={action.count}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            bgcolor: theme.palette.error.main,
                            color: "white",
                            fontWeight: "bold",
                            minWidth: 24,
                            height: 24,
                            "& .MuiChip-label": {
                              px: 1,
                              fontSize: "0.75rem",
                            },
                          }}
                        />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="600" mb={1}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Products Waiting for Approval Section */}
        {pendingProducts.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.02)} 0%, ${alpha("#fff", 0.95)} 100%)`,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.warning.main,
                    width: 48,
                    height: 48,
                  }}
                >
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="600" mb={0.5}>
                    Products Waiting for Approval
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products submitted by vendors awaiting your review
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<ScheduleIcon />}
                  label={`${pendingProducts.length} Pending`}
                  color="warning"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    height: 36,
                  }}
                />
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<AssignmentIcon />}
                  onClick={() => router.push("/adminDashboard/approvals")}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  Review All
                </Button>
              </Stack>
            </Stack>
            <Divider sx={{ mb: 3 }} />
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
                  backgroundColor: alpha(theme.palette.warning.main, 0.5),
                  borderRadius: 4,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.warning.main, 0.7),
                  },
                },
              }}
            >
              {pendingProducts.map((product) => (
                <Box key={product._id} sx={{ position: "relative", minWidth: 280 }}>
                  <ProductCard
                    image={`http://localhost:5000/${product.image}`}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    status={product.status}
                  />
                  {/* Quick Action Buttons */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      right: 16,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleQuickAction(product._id, "approved")}
                      disabled={processingIds.has(product._id)}
                      sx={{
                        flex: 1,
                        fontSize: "0.75rem",
                        py: 0.5,
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<CancelIcon />}
                      onClick={() => handleQuickAction(product._id, "rejected")}
                      disabled={processingIds.has(product._id)}
                      sx={{
                        flex: 1,
                        fontSize: "0.75rem",
                        py: 0.5,
                      }}
                    >
                      Reject
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Approved Products Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.02)} 0%, ${alpha("#fff", 0.95)} 100%)`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.success.main,
                  width: 48,
                  height: 48,
                }}
              >
                <CheckCircleIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="600" mb={0.5}>
                  Approved Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Products that are live and available for customers
                </Typography>
              </Box>
            </Stack>
            <Chip
              icon={<CheckCircleIcon />}
              label={`${approvedProducts.length} Products`}
              color="success"
              variant="outlined"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                height: 36,
              }}
            />
          </Stack>
          <Divider sx={{ mb: 3 }} />
          {approvedProducts.length > 0 ? (
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
                    backgroundColor: alpha(theme.palette.success.main, 0.7),
                  },
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
                py: 8,
                color: "text.secondary",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6" mb={1}>
                No approved products yet
              </Typography>
              <Typography variant="body2">
                Products will appear here once they are approved
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
              background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.02)} 0%, ${alpha("#fff", 0.95)} 100%)`,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.error.main,
                    width: 48,
                    height: 48,
                  }}
                >
                  <CancelIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="600" mb={0.5}>
                    Rejected Products
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products that need revision before approval
                  </Typography>
                </Box>
              </Stack>
              <Chip
                icon={<CancelIcon />}
                label={`${rejectedProducts.length} Products`}
                color="error"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  height: 36,
                }}
              />
            </Stack>
            <Divider sx={{ mb: 3 }} />
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
                  backgroundColor: alpha(theme.palette.error.main, 0.5),
                  borderRadius: 4,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.7),
                  },
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

export default AdminDashboard;